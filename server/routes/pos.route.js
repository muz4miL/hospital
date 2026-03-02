import express from 'express';
import {
  createSale,
  getSales,
  getSaleById,
  getTodaySummary,
  getAnalytics,
  searchMedicine,
  getExpiryAlerts,
  getLowStockAlerts,
  getDashboardStats,
} from '../controllers/pos.controller.js';

const router = express.Router();

// POS
router.post('/sale', createSale);
router.get('/sales', getSales);
router.get('/sale/:id', getSaleById);
router.get('/today-summary', getTodaySummary);
router.get('/analytics', getAnalytics);

// Quick search for POS
router.get('/search', searchMedicine);

// Alerts
router.get('/expiry-alerts', getExpiryAlerts);
router.get('/low-stock', getLowStockAlerts);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

export default router;
