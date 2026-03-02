import Sale from '../models/sale.model.js';
import Inventory from '../models/inventory.model.js';

// Create a new sale (POS checkout)
export const createSale = async (req, res) => {
  try {
    const { items, discount, discountType, tax, amountPaid, paymentMethod, customerName, customerPhone, soldBy, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const medicine = await Inventory.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ success: false, message: `Medicine not found: ${item.medicineName}` });
      }
      if (medicine.Mquantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${medicine.Mname}. Available: ${medicine.Mquantity}` });
      }

      const total = medicine.Mprice * item.quantity;
      subtotal += total;

      processedItems.push({
        medicineId: medicine._id,
        medicineName: medicine.Mname,
        quantity: item.quantity,
        unitPrice: medicine.Mprice,
        costPrice: medicine.McostPrice || 0,
        total,
      });

      // Deduct from inventory
      medicine.Mquantity -= item.quantity;
      if (medicine.Mquantity <= 0) {
        medicine.status = 'Out of Stock';
      } else if (medicine.Mquantity <= (medicine.reorderLevel || 20)) {
        medicine.status = 'Low Stock';
      }
      await medicine.save();
    }

    // Calculate discount
    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * (discount || 0)) / 100;
    } else {
      discountAmount = discount || 0;
    }

    const taxAmount = (subtotal - discountAmount) * ((tax || 0) / 100);
    const grandTotal = subtotal - discountAmount + taxAmount;
    const change = (amountPaid || grandTotal) - grandTotal;

    const sale = new Sale({
      items: processedItems,
      subtotal,
      discount: discountAmount,
      discountType: discountType || 'fixed',
      tax: taxAmount,
      grandTotal,
      amountPaid: amountPaid || grandTotal,
      change: change > 0 ? change : 0,
      paymentMethod: paymentMethod || 'Cash',
      customerName: customerName || 'Walk-in Customer',
      customerPhone,
      soldBy: soldBy || 'Admin',
      notes,
    });

    await sale.save();

    res.status(201).json({ success: true, message: 'Sale completed!', sale });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all sales with pagination
export const getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Date filtering
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate + 'T23:59:59'),
      };
    } else if (req.query.today === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter.createdAt = { $gte: today, $lt: tomorrow };
    }

    const sales = await Sale.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments(filter);

    res.status(200).json({ success: true, sales, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get a single sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.status(200).json({ success: true, sale });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get today's sales summary (dashboard)
export const getTodaySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: 'Completed',
    });

    const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.grandTotal, 0);
    const totalProfit = todaySales.reduce((sum, sale) => {
      const cost = sale.items.reduce((c, item) => c + (item.costPrice * item.quantity), 0);
      return sum + (sale.grandTotal - cost);
    }, 0);
    const totalTransactions = todaySales.length;
    const totalItems = todaySales.reduce((sum, sale) => sum + sale.items.reduce((s, item) => s + item.quantity, 0), 0);

    // Top selling medicines today
    const medicineMap = {};
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        if (medicineMap[item.medicineName]) {
          medicineMap[item.medicineName].quantity += item.quantity;
          medicineMap[item.medicineName].revenue += item.total;
        } else {
          medicineMap[item.medicineName] = {
            name: item.medicineName,
            quantity: item.quantity,
            revenue: item.total,
          };
        }
      });
    });

    const topSelling = Object.values(medicineMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Hourly sales breakdown
    const hourlySales = Array(24).fill(0);
    todaySales.forEach(sale => {
      const hour = new Date(sale.createdAt).getHours();
      hourlySales[hour] += sale.grandTotal;
    });

    res.status(200).json({
      success: true,
      summary: {
        totalRevenue,
        totalProfit,
        totalTransactions,
        totalItems,
        topSelling,
        hourlySales,
        averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get weekly/monthly analytics
export const getAnalytics = async (req, res) => {
  try {
    const period = req.query.period || '7'; // days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'Completed',
    }).sort({ createdAt: 1 });

    // Daily totals
    const dailyMap = {};
    sales.forEach(sale => {
      const day = new Date(sale.createdAt).toISOString().split('T')[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, revenue: 0, transactions: 0, items: 0 };
      }
      dailyMap[day].revenue += sale.grandTotal;
      dailyMap[day].transactions += 1;
      dailyMap[day].items += sale.items.reduce((s, item) => s + item.quantity, 0);
    });

    const dailyData = Object.values(dailyMap);

    // Top medicines in period
    const medicineMap = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!medicineMap[item.medicineName]) {
          medicineMap[item.medicineName] = { name: item.medicineName, quantity: 0, revenue: 0 };
        }
        medicineMap[item.medicineName].quantity += item.quantity;
        medicineMap[item.medicineName].revenue += item.total;
      });
    });

    const topMedicines = Object.values(medicineMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 15);

    // Payment method breakdown
    const paymentBreakdown = {};
    sales.forEach(sale => {
      if (!paymentBreakdown[sale.paymentMethod]) {
        paymentBreakdown[sale.paymentMethod] = { method: sale.paymentMethod, count: 0, total: 0 };
      }
      paymentBreakdown[sale.paymentMethod].count += 1;
      paymentBreakdown[sale.paymentMethod].total += sale.grandTotal;
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.grandTotal, 0);
    const totalTransactions = sales.length;

    res.status(200).json({
      success: true,
      analytics: {
        period: parseInt(period),
        totalRevenue,
        totalTransactions,
        averageDaily: dailyData.length > 0 ? totalRevenue / dailyData.length : 0,
        dailyData,
        topMedicines,
        paymentBreakdown: Object.values(paymentBreakdown),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Search medicine for POS (quick search by name or barcode)
export const searchMedicine = async (req, res) => {
  try {
    const query = req.query.q || '';
    if (query.length < 1) {
      return res.status(200).json({ success: true, results: [] });
    }

    let results;

    // Check if it might be a barcode (numeric or starts with KMP)
    if (/^\d{8,13}$/.test(query) || query.startsWith('KMP')) {
      results = await Inventory.find({
        $or: [
          { factoryBarcode: query },
          { generatedBarcode: query },
        ],
        status: { $ne: 'Expired' },
      }).limit(5);
    }

    // If no barcode match, search by name
    if (!results || results.length === 0) {
      results = await Inventory.find({
        Mname: { $regex: query, $options: 'i' },
        status: { $ne: 'Expired' },
        Mquantity: { $gt: 0 },
      }).limit(10);
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get expiry alerts
export const getExpiryAlerts = async (req, res) => {
  try {
    const now = new Date();
    const days30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const days60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const days90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const alreadyExpired = await Inventory.find({ expirAt: { $lt: now } }).sort({ expirAt: 1 });
    const expiring30 = await Inventory.find({ expirAt: { $gte: now, $lte: days30 } }).sort({ expirAt: 1 });
    const expiring60 = await Inventory.find({ expirAt: { $gt: days30, $lte: days60 } }).sort({ expirAt: 1 });
    const expiring90 = await Inventory.find({ expirAt: { $gt: days60, $lte: days90 } }).sort({ expirAt: 1 });

    const expiredValue = alreadyExpired.reduce((sum, item) => sum + (item.Mprice * item.Mquantity), 0);
    const atRiskValue = expiring30.reduce((sum, item) => sum + (item.Mprice * item.Mquantity), 0);

    res.status(200).json({
      success: true,
      alerts: {
        expired: { count: alreadyExpired.length, items: alreadyExpired, totalValue: expiredValue },
        expiring30: { count: expiring30.length, items: expiring30, totalValue: atRiskValue },
        expiring60: { count: expiring60.length, items: expiring60 },
        expiring90: { count: expiring90.length, items: expiring90 },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  try {
    const lowStock = await Inventory.find({
      $expr: { $lte: ['$Mquantity', '$reorderLevel'] },
      status: { $ne: 'Expired' },
    }).sort({ Mquantity: 1 });

    const outOfStock = await Inventory.find({
      Mquantity: { $lte: 0 },
    }).sort({ Mname: 1 });

    res.status(200).json({
      success: true,
      alerts: {
        lowStock: { count: lowStock.length, items: lowStock },
        outOfStock: { count: outOfStock.length, items: outOfStock },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Dashboard overview stats
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const days30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Total inventory
    const totalMedicines = await Inventory.countDocuments();
    const totalInventoryValue = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$Mprice', '$Mquantity'] } } } },
    ]);

    // Expiry alerts
    const expiringCount = await Inventory.countDocuments({ expirAt: { $gte: new Date(), $lte: days30 } });
    const expiredCount = await Inventory.countDocuments({ expirAt: { $lt: new Date() } });

    // Low stock
    const lowStockCount = await Inventory.countDocuments({
      $expr: { $lte: ['$Mquantity', '$reorderLevel'] },
      Mquantity: { $gt: 0 },
    });
    const outOfStockCount = await Inventory.countDocuments({ Mquantity: { $lte: 0 } });

    // Today's sales
    const todaySales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: 'Completed',
    });
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.grandTotal, 0);
    const todayTransactions = todaySales.length;

    // Last 7 days revenue
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekSales = await Sale.find({
      createdAt: { $gte: last7Days },
      status: 'Completed',
    });
    const weekRevenue = weekSales.reduce((sum, s) => sum + s.grandTotal, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalMedicines,
        totalInventoryValue: totalInventoryValue[0]?.total || 0,
        expiringCount,
        expiredCount,
        lowStockCount,
        outOfStockCount,
        todayRevenue,
        todayTransactions,
        weekRevenue,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
