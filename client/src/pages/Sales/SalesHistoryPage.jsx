import React, { useState, useEffect, useCallback } from 'react';
import SideBar from '../../components/SideBar';
import { FiBarChart2, FiSearch, FiDownload, FiCalendar, FiEye, FiPrinter } from 'react-icons/fi';
import { BiReceipt } from 'react-icons/bi';
import toast, { Toaster } from 'react-hot-toast';

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      let url = `/api/pos/sales?page=${page}&limit=20`;
      if (dateFrom) url += `&dateFrom=${dateFrom}`;
      if (dateTo) url += `&dateTo=${dateTo}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setSales(json.sales);
        setTotalPages(json.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  }, [page, dateFrom, dateTo]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, summaryRes] = await Promise.all([
        fetch('/api/pos/analytics'),
        fetch('/api/pos/today-summary')
      ]);
      const analyticsData = await analyticsRes.json();
      const summaryData = await summaryRes.json();
      if (analyticsData.success) setAnalytics(analyticsData.analytics);
      if (summaryData.success) setTodaySummary(summaryData.summary);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    }
  };

  useEffect(() => { fetchSales(); }, [fetchSales]);
  useEffect(() => { fetchAnalytics(); }, []);

  const viewSale = async (id) => {
    try {
      const res = await fetch(`/api/pos/sale/${id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedSale(json.sale);
        setShowReceipt(true);
      }
    } catch (err) {
      toast.error('Failed to load sale details');
    }
  };

  const printReceipt = () => {
    if (!selectedSale) return;
    const win = window.open('', '_blank', 'width=300,height=600');
    win.document.write(`
      <html><head><title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; max-width: 280px; }
        .center { text-align: center; }
        .line { border-top: 1px dashed #000; margin: 5px 0; }
        .row { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
        .big { font-size: 14px; }
      </style></head><body>
      <div class="center bold big">PHARMACY</div>
      <div class="center">Peshawar, Pakistan</div>
      <div class="line"></div>
      <div class="row"><span>Invoice:</span><span>${selectedSale.invoiceNumber}</span></div>
      <div class="row"><span>Date:</span><span>${new Date(selectedSale.createdAt).toLocaleString('en-PK')}</span></div>
      ${selectedSale.customerName ? `<div class="row"><span>Customer:</span><span>${selectedSale.customerName}</span></div>` : ''}
      <div class="line"></div>
      ${selectedSale.items.map(item => `
        <div>${item.medicineName}</div>
        <div class="row"><span>${item.quantity} x PKR ${item.unitPrice}</span><span>PKR ${item.totalPrice}</span></div>
      `).join('')}
      <div class="line"></div>
      <div class="row"><span>Subtotal:</span><span>PKR ${selectedSale.subtotal}</span></div>
      ${selectedSale.discountAmount > 0 ? `<div class="row"><span>Discount:</span><span>-PKR ${selectedSale.discountAmount}</span></div>` : ''}
      <div class="row bold big"><span>TOTAL:</span><span>PKR ${selectedSale.grandTotal}</span></div>
      <div class="row"><span>Paid:</span><span>PKR ${selectedSale.amountPaid}</span></div>
      ${selectedSale.change > 0 ? `<div class="row"><span>Change:</span><span>PKR ${selectedSale.change}</span></div>` : ''}
      <div class="row"><span>Payment:</span><span>${selectedSale.paymentMethod}</span></div>
      <div class="line"></div>
      <div class="center">Thank you for your purchase!</div>
      <div class="center" style="margin-top:10px;font-size:10px">Powered by PharmaSys</div>
      <script>window.print();</script></body></html>
    `);
    win.document.close();
  };

  const exportSalesCSV = () => {
    if (!sales.length) { toast.error('No sales to export'); return; }
    const headers = ['Invoice', 'Date', 'Items', 'Subtotal', 'Discount', 'Total', 'Payment', 'Customer', 'Status'];
    const rows = sales.map(s => [
      s.invoiceNumber,
      new Date(s.createdAt).toLocaleString('en-PK'),
      s.items.length,
      s.subtotal,
      s.discountAmount || 0,
      s.grandTotal,
      s.paymentMethod,
      s.customerName || '-',
      s.status
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const formatCurrency = (val) => `PKR ${(val || 0).toLocaleString()}`;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <SideBar />
      <Toaster position="top-right" />
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiBarChart2 className="text-emerald-400" /> Sales & Reports
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track revenue, view invoices, and analyze trends</p>
          </div>
          <button onClick={exportSalesCSV} className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
            <FiDownload /> Export CSV
          </button>
        </div>

        {/* Today's Summary */}
        {todaySummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Today's Revenue</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(todaySummary.totalRevenue)}</p>
              <p className="text-gray-600 text-xs mt-1">{todaySummary.totalTransactions || 0} sales today</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Today's Profit</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(todaySummary.totalProfit)}</p>
              <p className="text-gray-600 text-xs mt-1">
                {todaySummary.totalRevenue > 0 ? ((todaySummary.totalProfit / todaySummary.totalRevenue) * 100).toFixed(1) : '0'}% margin
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Avg Sale</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(todaySummary.totalTransactions > 0 ? todaySummary.totalRevenue / todaySummary.totalTransactions : 0)}
              </p>
              <p className="text-gray-600 text-xs mt-1">per transaction</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Top Seller Today</p>
              <p className="text-lg font-bold text-white mt-1">
                {todaySummary.topSelling?.[0]?.name || 'No sales yet'}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {todaySummary.topSelling?.[0]?.quantity || 0} units sold
              </p>
            </div>
          </div>
        )}

        {/* Payment Breakdown & Top Sellers */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Payment Methods */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-white font-medium text-sm mb-4">Payment Methods (Last 30 Days)</h3>
              <div className="space-y-3">
                {(analytics.paymentBreakdown || []).map((p, i) => {
                  const total = analytics.paymentBreakdown.reduce((s, x) => s + x.total, 0);
                  const pct = total > 0 ? (p.total / total * 100) : 0;
                  const colors = { Cash: 'bg-emerald-500', Card: 'bg-blue-500', Mobile: 'bg-purple-500', Credit: 'bg-orange-500' };
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{p.method}</span>
                        <span className="text-gray-300">{formatCurrency(p.total)} ({p.count})</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className={`${colors[p.method] || 'bg-gray-500'} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {(!analytics.paymentBreakdown || analytics.paymentBreakdown.length === 0) && (
                  <p className="text-gray-600 text-sm">No payment data available</p>
                )}
              </div>
            </div>
            {/* Top Selling */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-white font-medium text-sm mb-4">Top Selling Medicines (Last 30 Days)</h3>
              <div className="space-y-2">
                {(analytics.topMedicines || []).slice(0, 8).map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-emerald-500/20 text-emerald-400' : i === 1 ? 'bg-blue-500/20 text-blue-400' : i === 2 ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-500'
                      }`}>{i + 1}</span>
                      <span className="text-gray-300 text-sm">{m.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-sm">{m.quantity} units</span>
                      <span className="text-gray-600 text-xs ml-2">{formatCurrency(m.revenue)}</span>
                    </div>
                  </div>
                ))}
                {(!analytics.topMedicines || analytics.topMedicines.length === 0) && (
                  <p className="text-gray-600 text-sm">No sales data available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date Filter & Sales Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <BiReceipt className="text-emerald-400" /> Sales History
            </h3>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none" />
              <span className="text-gray-600 text-xs">to</span>
              <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none" />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(''); setDateTo(''); setPage(1); }} className="text-gray-500 hover:text-gray-300 text-xs underline">Clear</button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Invoice</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Date & Time</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Items</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Payment</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Customer</th>
                  <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-gray-600">
                    <BiReceipt className="mx-auto text-3xl mb-2" />
                    <p>No sales found</p>
                    <p className="text-xs mt-1">Sales made from POS will appear here</p>
                  </td></tr>
                ) : (
                  sales.map((sale) => {
                    const paymentColors = { Cash: 'text-emerald-400 bg-emerald-500/10', Card: 'text-blue-400 bg-blue-500/10', Mobile: 'text-purple-400 bg-purple-500/10', Credit: 'text-orange-400 bg-orange-500/10' };
                    return (
                      <tr key={sale._id} className="hover:bg-gray-800/50 transition">
                        <td className="px-4 py-3">
                          <span className="text-emerald-400 text-sm font-mono font-medium">{sale.invoiceNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-300 text-sm">{new Date(sale.createdAt).toLocaleDateString('en-PK')}</p>
                          <p className="text-gray-600 text-xs">{new Date(sale.createdAt).toLocaleTimeString('en-PK')}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-gray-300 text-sm">{sale.items.length}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-white text-sm font-medium">{formatCurrency(sale.grandTotal)}</span>
                          {sale.discountAmount > 0 && (
                            <p className="text-gray-600 text-xs">-{formatCurrency(sale.discountAmount)} disc</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentColors[sale.paymentMethod] || 'text-gray-400 bg-gray-800'}`}>
                            {sale.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{sale.customerName || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => viewSale(sale._id)} className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-gray-800 rounded transition" title="View">
                              <FiEye className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition">
                Previous
              </button>
              <span className="text-gray-500 text-xs">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedSale && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowReceipt(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-medium">Invoice {selectedSale.invoiceNumber}</h3>
              <div className="flex gap-2">
                <button onClick={printReceipt} className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-gray-800 rounded transition">
                  <FiPrinter />
                </button>
                <button onClick={() => setShowReceipt(false)} className="text-gray-500 hover:text-gray-300 text-xl">&times;</button>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="text-gray-300">{new Date(selectedSale.createdAt).toLocaleString('en-PK')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Payment:</span><span className="text-gray-300">{selectedSale.paymentMethod}</span></div>
                {selectedSale.customerName && <div className="flex justify-between"><span className="text-gray-500">Customer:</span><span className="text-gray-300">{selectedSale.customerName}</span></div>}
              </div>

              <div className="border-t border-dashed border-gray-700 py-3 space-y-2">
                {selectedSale.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-300">{item.medicineName}</p>
                      <p className="text-gray-600 text-xs">{item.quantity} x PKR {item.unitPrice}</p>
                    </div>
                    <span className="text-gray-300">PKR {item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-700 pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-300">PKR {selectedSale.subtotal}</span></div>
                {selectedSale.discountAmount > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-red-400">-PKR {selectedSale.discountAmount}</span></div>
                )}
                <div className="flex justify-between text-base font-bold pt-1"><span className="text-white">Total</span><span className="text-emerald-400">PKR {selectedSale.grandTotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Paid</span><span className="text-gray-300">PKR {selectedSale.amountPaid}</span></div>
                {selectedSale.change > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Change</span><span className="text-yellow-400">PKR {selectedSale.change}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
