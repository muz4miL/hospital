import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import {
  FiShoppingCart,
  FiAlertTriangle,
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiAlertCircle,
  FiCalendar,
  FiBarChart2,
  FiX,
  FiPrinter,
  FiHash,
  FiPercent,
  FiBox,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";
import { BiTime } from "react-icons/bi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Filler);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [expiryAlerts, setExpiryAlerts] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [todaySummary, setTodaySummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [payroll, setPayroll] = useState({ thisMonth: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [zReportOpen, setZReportOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, expiryRes, lowStockRes, summaryRes, analyticsRes, salaryRes] = await Promise.all([
        fetch("/api/pos/dashboard-stats"),
        fetch("/api/pos/expiry-alerts"),
        fetch("/api/pos/low-stock"),
        fetch("/api/pos/today-summary"),
        fetch("/api/pos/analytics?period=7"),
        fetch("/api/employeeSalary/read"),
      ]);
      const [statsData, expiryData, lowStockData, summaryData, analyticsData, salaryData] =
        await Promise.all([
          statsRes.json(),
          expiryRes.json(),
          lowStockRes.json(),
          summaryRes.json(),
          analyticsRes.json(),
          salaryRes.json(),
        ]);
      if (statsData.success) setStats(statsData.stats);
      if (expiryData.success) setExpiryAlerts(expiryData.alerts);
      if (lowStockData.success) setLowStock(lowStockData.alerts);
      if (summaryData.success) setTodaySummary(summaryData.summary);
      if (analyticsData.success) setAnalytics(analyticsData.analytics);
      if (salaryData.success) {
        const records = salaryData.records || [];
        const now = new Date();
        const thisMonth = records
          .filter((r) => r.employeeName && r.status === "Paid" && (() => { const d = new Date(r.paymentDate); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })())
          .reduce((s, r) => s + (r.amount || 0), 0);
        const total = records
          .filter((r) => r.employeeName && r.status === "Paid")
          .reduce((s, r) => s + (r.amount || 0), 0);
        setPayroll({ thisMonth, total });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
    setLoading(false);
  };

  const StatCard = ({ icon, title, value, subtitle, extra, color, link }) => (
    <Link
      to={link || "#"}
      className={`bg-zinc-900 rounded-xl p-5 border border-zinc-800 shadow-lg shadow-black/20 hover:border-${color}-500/40 transition-all hover:shadow-${color}-500/10 group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold text-zinc-100 mt-1`}>{value}</p>
          {subtitle && (
            <p className={`text-xs text-${color}-400 mt-1`}>{subtitle}</p>
          )}
          {extra && (
            <p className="text-xs text-orange-400 mt-0.5">{extra}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 transition-colors`}
        >
          {icon}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-zinc-950">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
            <p className="text-zinc-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">
              <BiTime className="inline mr-1" />
              {new Date().toLocaleDateString("en-PK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZReportOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-100 rounded-lg font-medium transition-colors"
            >
              <FiPrinter /> Close Register (Z-Report)
            </button>
            <Link
              to="/pos"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              <FiShoppingCart /> Open POS
            </Link>
          </div>
        </div>

        {/* Alert Banners */}
        {expiryAlerts &&
          (expiryAlerts.expired.count > 0 ||
            expiryAlerts.expiring30.count > 0) && (
            <div className="mb-6 space-y-2">
              {expiryAlerts.expired.count > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <FiAlertCircle className="text-red-400 text-xl flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-400 font-medium">
                      {expiryAlerts.expired.count} medicines have EXPIRED!
                    </p>
                    <p className="text-red-400/70 text-sm">
                      Total value at risk: Rs.{" "}
                      {expiryAlerts.expired.totalValue?.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to="/expiry-alerts"
                    className="text-red-400 text-sm hover:text-red-300 whitespace-nowrap"
                  >
                    View All →
                  </Link>
                </div>
              )}
              {expiryAlerts.expiring30.count > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <FiAlertTriangle className="text-orange-400 text-xl flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-orange-400 font-medium">
                      {expiryAlerts.expiring30.count} medicines expiring in 30
                      days
                    </p>
                    <p className="text-orange-400/70 text-sm">
                      Worth Rs.{" "}
                      {expiryAlerts.expiring30.totalValue?.toLocaleString()} —
                      Action needed!
                    </p>
                  </div>
                  <Link
                    to="/expiry-alerts"
                    className="text-orange-400 text-sm hover:text-orange-300 whitespace-nowrap"
                  >
                    View All →
                  </Link>
                </div>
              )}
            </div>
          )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<FiDollarSign size={22} />}
            title="Today's Revenue"
            value={`Rs. ${(stats?.todayRevenue || 0).toLocaleString()}`}
            subtitle={`${stats?.todayTransactions || 0} transactions`}
            extra={stats?.todayDiscounts > 0 ? `Discounts: Rs. ${(stats.todayDiscounts).toLocaleString()}` : undefined}
            color="emerald"
            link="/sales-history"
          />
          <StatCard
            icon={<FiTrendingUp size={22} />}
            title="This Week"
            value={`Rs. ${(stats?.weekRevenue || 0).toLocaleString()}`}
            subtitle="Last 7 days"
            color="blue"
            link="/sales-history"
          />
          <StatCard
            icon={<FiPackage size={22} />}
            title="Medicines"
            value={stats?.totalMedicines || 0}
            subtitle={`Rs. ${(stats?.totalInventoryValue || 0).toLocaleString()} value`}
            color="purple"
            link="/inventory-management"
          />
          <StatCard
            icon={<FiAlertTriangle size={22} />}
            title="Alerts"
            value={(stats?.expiringCount || 0) + (stats?.lowStockCount || 0)}
            subtitle={`${stats?.expiringCount || 0} expiring, ${stats?.lowStockCount || 0} low`}
            color="orange"
            link="/expiry-alerts"
          />
          <StatCard
            icon={<FiUsers size={22} />}
            title="Payroll This Month"
            value={`Rs. ${payroll.thisMonth.toLocaleString()}`}
            subtitle={`All-time: Rs. ${payroll.total.toLocaleString()}`}
            color="teal"
            link="/employee-salary-management"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <FiBarChart2 className="text-emerald-400" /> Revenue — Last 7 Days
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Total: Rs. {(analytics?.totalRevenue || 0).toLocaleString()} · {analytics?.totalTransactions || 0} transactions
                </p>
              </div>
              <Link to="/sales-history" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                View All <FiArrowUpRight className="text-xs" />
              </Link>
            </div>
            {analytics?.dailyData?.length > 0 ? (
              <div className="h-52">
                <Bar
                  data={{
                    labels: (() => {
                      const days = [];
                      for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        days.push(d.toLocaleDateString("en-PK", { weekday: "short", day: "numeric" }));
                      }
                      return days;
                    })(),
                    datasets: [{
                      label: "Revenue (Rs.)",
                      data: (() => {
                        const result = [];
                        for (let i = 6; i >= 0; i--) {
                          const d = new Date();
                          d.setDate(d.getDate() - i);
                          const key = d.toISOString().split("T")[0];
                          const found = analytics.dailyData.find((x) => x.date === key);
                          result.push(found ? found.revenue : 0);
                        }
                        return result;
                      })(),
                      backgroundColor: "rgba(16, 185, 129, 0.25)",
                      borderColor: "rgba(16, 185, 129, 0.9)",
                      borderWidth: 2,
                      borderRadius: 6,
                      hoverBackgroundColor: "rgba(16, 185, 129, 0.5)",
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: {
                      callbacks: { label: (ctx) => ` Rs. ${ctx.raw.toLocaleString()}` },
                      backgroundColor: "#18181b",
                      borderColor: "#3f3f46",
                      borderWidth: 1,
                      titleColor: "#a1a1aa",
                      bodyColor: "#f4f4f5",
                    }},
                    scales: {
                      x: { grid: { color: "rgba(63,63,70,0.4)" }, ticks: { color: "#71717a", font: { size: 11 } } },
                      y: { grid: { color: "rgba(63,63,70,0.4)" }, ticks: { color: "#71717a", font: { size: 11 }, callback: (v) => `Rs.${(v/1000).toFixed(0)}k` }, beginAtZero: true },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center">
                <FiBarChart2 className="text-zinc-700 text-4xl mb-3" />
                <p className="text-zinc-500 text-sm">No sales data yet</p>
              </div>
            )}

            {/* Top Selling Today mini-list */}
            {todaySummary?.topSelling?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-3">Top Selling Today</p>
                <div className="space-y-2">
                  {todaySummary.topSelling.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                        i === 1 ? "bg-zinc-500/20 text-zinc-300" :
                        i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-zinc-800 text-zinc-500"
                      }`}>{i + 1}</span>
                      <p className="text-zinc-300 text-sm flex-1 truncate">{item.name}</p>
                      <div className="text-right flex-shrink-0">
                        <p className="text-emerald-400 text-sm font-semibold">Rs. {item.revenue.toLocaleString()}</p>
                        <p className="text-zinc-600 text-xs">{item.quantity} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!todaySummary?.topSelling?.length && !analytics?.dailyData?.length && (
              <div className="text-center py-4">
                <Link to="/pos" className="text-emerald-400 text-sm hover:text-emerald-300">Start selling →</Link>
              </div>
            )}
          </div>

          {/* Right Column: Alerts */}
          <div className="space-y-6">
            {/* Expiry Alerts */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-5">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                <FiCalendar className="text-orange-400" /> Expiry Alerts
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-zinc-300">Expired</span>
                  </div>
                  <span className="text-red-400 font-bold">
                    {expiryAlerts?.expired?.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm text-zinc-300">30 Days</span>
                  </div>
                  <span className="text-orange-400 font-bold">
                    {expiryAlerts?.expiring30?.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-zinc-300">60 Days</span>
                  </div>
                  <span className="text-yellow-400 font-bold">
                    {expiryAlerts?.expiring60?.count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-zinc-300">90 Days</span>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    {expiryAlerts?.expiring90?.count || 0}
                  </span>
                </div>
              </div>
              <Link
                to="/expiry-alerts"
                className="block mt-3 text-center text-sm text-emerald-400 hover:text-emerald-300"
              >
                View Details →
              </Link>
            </div>

            {/* Low Stock */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-5">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                <FiAlertTriangle className="text-yellow-400" /> Stock Alerts
              </h2>
              {lowStock?.lowStock?.items?.length > 0 ? (
                <div className="space-y-2">
                  {lowStock.lowStock.items.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50"
                    >
                      <span className="text-sm text-zinc-300 truncate flex-1">
                        {item.Mname}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.Mquantity <= 0
                            ? "bg-red-500/20 text-red-400"
                            : item.Mquantity <= 10
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {item.Mquantity} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm text-center py-4">
                  All stock levels OK!
                </p>
              )}
              {lowStock?.outOfStock?.count > 0 && (
                <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-500/20 text-center">
                  <p className="text-red-400 text-sm font-medium">
                    {lowStock.outOfStock.count} items out of stock
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { to: "/pos", Icon: FiShoppingCart, color: "emerald", label: "Point of Sale", sub: "Start billing" },
            { to: "/create-inventory", Icon: FiPackage, color: "blue", label: "Add Medicine", sub: "New inventory" },
            { to: "/sales-history", Icon: FiBarChart2, color: "purple", label: "Sales Report", sub: "View analytics" },
            { to: "/expiry-alerts", Icon: FiAlertTriangle, color: "orange", label: "Expiry Alerts", sub: "Check medicines" },
            { to: "/employee-salary-management", Icon: FiDollarSign, color: "teal", label: "Payroll", sub: "Record salary" },
            { to: "/employee-leave-management", Icon: FiCalendar, color: "pink", label: "Leave Records", sub: "Manage leave" },
          ].map(({ to, Icon, color, label, sub }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 p-4 bg-${color}-600/10 border border-${color}-600/30 rounded-xl hover:bg-${color}-600/20 transition-colors`}
            >
              <Icon className={`text-${color}-400 text-xl flex-shrink-0`} />
              <div>
                <p className="text-zinc-100 font-medium text-sm">{label}</p>
                <p className="text-zinc-500 text-xs">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Z-Report Modal */}
      {zReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setZReportOpen(false)}
          />
          {/* Modal */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/40 w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">End of Day — Z-Report</h2>
                <p className="text-zinc-500 text-sm mt-0.5">
                  {new Date().toLocaleDateString("en-PK", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setZReportOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <FiDollarSign className="text-emerald-400" size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Expected Cash in Drawer</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    Rs. {(stats?.todayRevenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-center">
                  <FiHash className="mx-auto text-blue-400 mb-2" size={20} />
                  <p className="text-2xl font-bold text-zinc-100">
                    {stats?.todayTransactions || 0}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">Total Transactions</p>
                </div>
                <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-center">
                  <FiPercent className="mx-auto text-orange-400 mb-2" size={20} />
                  <p className="text-2xl font-bold text-zinc-100">
                    Rs. {(stats?.todayDiscounts || 0).toLocaleString()}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">Total Discounts</p>
                </div>
                <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-center">
                  <FiBox className="mx-auto text-purple-400 mb-2" size={20} />
                  <p className="text-2xl font-bold text-zinc-100">
                    {todaySummary?.topSelling?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">Items Sold</p>
                </div>
              </div>

              {todaySummary?.topSelling?.length > 0 && (
                <div className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-xl">
                  <p className="text-zinc-400 text-xs font-medium mb-2">TOP SELLER TODAY</p>
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-100 font-medium">{todaySummary.topSelling[0].name}</p>
                    <p className="text-emerald-400 font-bold">Rs. {todaySummary.topSelling[0].revenue.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
              <button
                onClick={() => setZReportOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-lg transition-colors"
              >
                <FiPrinter size={20} /> Confirm & Print EOD Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
