import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar';
import { FiAlertTriangle, FiSearch, FiDownload, FiPackage, FiClock } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

export default function ExpiryAlertsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExpiryAlerts();
  }, []);

  const fetchExpiryAlerts = async () => {
    try {
      const res = await fetch('/api/pos/expiry-alerts');
      const json = await res.json();
      if (json.success) {
        // Flatten the API response for easy consumption
        const alerts = json.alerts;
        setData({
          expired: alerts.expired?.items || [],
          expiring30: alerts.expiring30?.items || [],
          expiring60: alerts.expiring60?.items || [],
          expiring90: alerts.expiring90?.items || [],
          summary: {
            expiredCount: alerts.expired?.count || 0,
            expiredValue: alerts.expired?.totalValue || 0,
            expiring30Count: alerts.expiring30?.count || 0,
            expiring30Value: alerts.expiring30?.totalValue || 0,
            expiring60Count: alerts.expiring60?.count || 0,
            expiring60Value: 0,
            expiring90Count: alerts.expiring90?.count || 0,
            expiring90Value: 0,
          }
        });
      } else {
        toast.error('Failed to load expiry alerts');
      }
    } catch (err) {
      toast.error('Network error loading alerts');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMedicines = () => {
    if (!data) return [];
    let medicines = [];
    
    if (activeTab === 'all') {
      medicines = [
        ...(data.expired || []).map(m => ({ ...m, alertType: 'expired' })),
        ...(data.expiring30 || []).map(m => ({ ...m, alertType: '30days' })),
        ...(data.expiring60 || []).map(m => ({ ...m, alertType: '60days' })),
        ...(data.expiring90 || []).map(m => ({ ...m, alertType: '90days' })),
      ];
    } else if (activeTab === 'expired') {
      medicines = (data.expired || []).map(m => ({ ...m, alertType: 'expired' }));
    } else if (activeTab === '30days') {
      medicines = (data.expiring30 || []).map(m => ({ ...m, alertType: '30days' }));
    } else if (activeTab === '60days') {
      medicines = (data.expiring60 || []).map(m => ({ ...m, alertType: '60days' }));
    } else if (activeTab === '90days') {
      medicines = (data.expiring90 || []).map(m => ({ ...m, alertType: '90days' }));
    }

    if (searchTerm) {
      medicines = medicines.filter(m => 
        m.Mname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.Msupplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return medicines;
  };

  const getAlertBadge = (type) => {
    switch (type) {
      case 'expired': return <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">EXPIRED</span>;
      case '30days': return <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">30 Days</span>;
      case '60days': return <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">60 Days</span>;
      case '90days': return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">90 Days</span>;
      default: return null;
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysUntilExpiry = (d) => {
    if (!d) return null;
    const diff = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const exportCSV = () => {
    const medicines = getFilteredMedicines();
    if (!medicines.length) { toast.error('No data to export'); return; }

    const headers = ['Medicine Name','Supplier','Batch','Expiry Date','Days Left','Quantity','Unit Price','Total Value','Alert'];
    const rows = medicines.map(m => [
      m.Mname, m.Msupplier, m.batchNumber || '-', formatDate(m.expDate),
      getDaysUntilExpiry(m.expDate), m.Mquantity, m.Mprice,
      (m.Mquantity * m.Mprice).toFixed(0), m.alertType
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expiry-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const medicines = getFilteredMedicines();
  const totalValue = medicines.reduce((sum, m) => sum + (m.Mquantity * m.Mprice), 0);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <SideBar />
      <Toaster position="top-right" />
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiAlertTriangle className="text-orange-400" /> Expiry Alerts
            </h1>
            <p className="text-gray-500 text-sm mt-1">Monitor medicine expiry dates and take action</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
            <FiDownload /> Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Total At Risk</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(data.summary?.expiredCount || 0) + (data.summary?.expiring30Count || 0) + (data.summary?.expiring60Count || 0) + (data.summary?.expiring90Count || 0)}
              </p>
              <p className="text-gray-600 text-xs mt-1">medicines</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-red-900/50">
              <p className="text-red-400 text-xs uppercase tracking-wide font-medium">Expired</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{data.summary?.expiredCount || 0}</p>
              <p className="text-gray-600 text-xs mt-1">PKR {(data.summary?.expiredValue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-orange-900/50">
              <p className="text-orange-400 text-xs uppercase tracking-wide font-medium">Within 30 Days</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">{data.summary?.expiring30Count || 0}</p>
              <p className="text-gray-600 text-xs mt-1">PKR {(data.summary?.expiring30Value || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-yellow-900/50">
              <p className="text-yellow-400 text-xs uppercase tracking-wide font-medium">Within 60 Days</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{data.summary?.expiring60Count || 0}</p>
              <p className="text-gray-600 text-xs mt-1">PKR {(data.summary?.expiring60Value || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-blue-900/50">
              <p className="text-blue-400 text-xs uppercase tracking-wide font-medium">Within 90 Days</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{data.summary?.expiring90Count || 0}</p>
              <p className="text-gray-600 text-xs mt-1">PKR {(data.summary?.expiring90Value || 0).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 bg-gray-900 p-1 rounded-lg">
            {[
              { id: 'all', label: 'All' },
              { id: 'expired', label: 'Expired' },
              { id: '30days', label: '30 Days' },
              { id: '60days', label: '60 Days' },
              { id: '90days', label: '90 Days' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search medicine, supplier, batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 w-72 focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        {/* Total value bar */}
        {medicines.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 mb-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm">{medicines.length} medicines found</span>
            <span className="text-gray-300 text-sm font-medium">
              Total Value at Risk: <span className="text-orange-400 font-bold">PKR {totalValue.toLocaleString()}</span>
            </span>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Medicine</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Supplier</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Batch</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Expiry Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Days Left</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Qty</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Price</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Value</th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-12 text-gray-600">
                        <FiPackage className="mx-auto text-3xl mb-2" />
                        <p>No medicines found in this category</p>
                      </td>
                    </tr>
                  ) : (
                    medicines.map((m, idx) => {
                      const days = getDaysUntilExpiry(m.expDate);
                      return (
                        <tr key={idx} className={`hover:bg-gray-800/50 transition ${m.alertType === 'expired' ? 'bg-red-500/5' : ''}`}>
                          <td className="px-4 py-3">
                            <p className="text-white text-sm font-medium">{m.Mname}</p>
                            <p className="text-gray-600 text-xs">{m.type || 'General'}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{m.Msupplier || '-'}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs font-mono">{m.batchNumber || '-'}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{formatDate(m.expDate)}</td>
                          <td className="px-4 py-3">
                            {days !== null && (
                              <span className={`text-sm font-medium ${
                                days < 0 ? 'text-red-400' : days <= 30 ? 'text-orange-400' : days <= 60 ? 'text-yellow-400' : 'text-blue-400'
                              }`}>
                                {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300 text-sm">{m.Mquantity}</td>
                          <td className="px-4 py-3 text-right text-gray-300 text-sm">PKR {m.Mprice?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-gray-300 text-sm font-medium">
                            PKR {(m.Mquantity * m.Mprice).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">{getAlertBadge(m.alertType)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Tips */}
        <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-white font-medium text-sm mb-3">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdDeleteOutline className="text-red-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium">Expired Medicines</p>
                <p className="text-gray-600 text-xs">Remove from inventory immediately. Contact supplier for returns if within return window.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiClock className="text-orange-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium">Expiring Soon (30 days)</p>
                <p className="text-gray-600 text-xs">Prioritize selling these first. Consider offering small discounts to clear stock.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPackage className="text-blue-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium">60-90 Day Window</p>
                <p className="text-gray-600 text-xs">Monitor closely. Don't reorder these items until current stock is sold.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
