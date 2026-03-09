import { useState, useEffect, useCallback } from "react";
import {
  FiPlus, FiPrinter, FiSearch, FiTrash2, FiEdit2, FiX,
  FiDollarSign, FiCalendar, FiTrendingUp, FiAlertTriangle,
  FiDownload, FiCheck, FiUsers,
} from "react-icons/fi";
import SideBar from "../../components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TYPES = ["Monthly Salary","Advance","Bonus","Overtime","Deduction"];
const METHODS = ["Cash","Bank Transfer","JazzCash","EasyPaisa","Cheque"];
const STATUSES = ["Paid","Pending","Cancelled"];
const monthOpts = (() => {
  const y = new Date().getFullYear();
  const o = [];
  for (let yr = y; yr >= yr - 1 && yr >= y - 1; yr--) MONTHS.forEach((m) => o.push(`${m} ${yr}`));
  return o;
})();

const blankForm = () => ({
  employeeId: "", employeeName: "", employeeRole: "", amount: "",
  paymentDate: new Date().toISOString().split("T")[0],
  paymentType: "Monthly Salary", paymentMethod: "Cash",
  month: `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
  status: "Paid", notes: "",
});

const initials = (n) => (!n ? "?" : n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2));
const COLORS = ["bg-emerald-600","bg-blue-600","bg-purple-600","bg-amber-600","bg-rose-600","bg-cyan-600","bg-indigo-600","bg-teal-600"];
const initialsColor = (n) => {
  if (!n) return COLORS[0];
  let h = 0;
  for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
};

export default function EmployeeSalaryManagement() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("ledger");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState(null); // null | "create" | "edit"
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blankForm());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [recRes, sumRes, empRes] = await Promise.all([
        axios.get("/api/employeeSalary/read"),
        axios.get("/api/employeeSalary/summary"),
        axios.get("/api/employee/read"),
      ]);
      setRecords(recRes.data.records || []);
      setSummary(sumRes.data.summary || []);
      setEmployees(empRes.data.employee || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Invalid records from old schema
  const invalidRecords = records.filter((r) => !r.employeeName);

  // Only show valid records in table
  const filtered = records
    .filter((r) => r.employeeName)
    .filter(
      (r) =>
        r.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
        r.paymentType?.toLowerCase().includes(search.toLowerCase()) ||
        r.month?.toLowerCase().includes(search.toLowerCase())
    );

  const validRecords = records.filter((r) => r.employeeName);
  const totals = {
    paid: validRecords.filter((r) => r.status === "Paid").reduce((s, r) => s + (r.amount || 0), 0),
    advances: validRecords.filter((r) => r.paymentType === "Advance" && r.status === "Paid").reduce((s, r) => s + (r.amount || 0), 0),
    thisMonth: validRecords
      .filter((r) => {
        const d = new Date(r.paymentDate);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && r.status === "Paid";
      })
      .reduce((s, r) => s + (r.amount || 0), 0),
  };

  /* ── Modal helpers ── */
  const openCreate = () => { setForm(blankForm()); setEditId(null); setModal("create"); };
  const openEdit = (r) => {
    setForm({
      employeeId: r.employeeId || "", employeeName: r.employeeName || "", employeeRole: r.employeeRole || "",
      amount: r.amount || "", paymentDate: r.paymentDate ? r.paymentDate.split("T")[0] : "",
      paymentType: r.paymentType || "Monthly Salary", paymentMethod: r.paymentMethod || "Cash",
      month: r.month || "", status: r.status || "Paid", notes: r.notes || "",
    });
    setEditId(r._id);
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleEmployeeSelect = (e) => {
    const emp = employees.find((x) => x._id === e.target.value);
    if (emp) setForm((f) => ({ ...f, employeeId: emp._id, employeeName: emp.name, employeeRole: emp.empRole || "" }));
  };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modal === "create" && !form.employeeId) return toast.error("Select an employee");
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");
    setSaving(true);
    try {
      if (modal === "create") {
        await axios.post("/api/employeeSalary/create", { ...form, amount: Number(form.amount) });
        toast.success("Payment recorded!");
      } else {
        await axios.put(`/api/employeeSalary/update/${editId}`, { ...form, amount: Number(form.amount) });
        toast.success("Record updated!");
      }
      closeModal();
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/employeeSalary/delete/${deleteId}`);
      setDeleteId(null);
      toast.success("Record deleted");
      fetchAll();
    } catch { toast.error("Delete failed"); }
  };

  const purgeInvalid = async () => {
    try {
      const res = await axios.delete("/api/employeeSalary/purge-invalid");
      toast.success(res.data.message || "Cleaned up!");
      fetchAll();
    } catch { toast.error("Cleanup failed"); }
  };

  const printPaySlip = (r) => {
    const w = window.open("", "_blank", "width=420,height=550");
    w.document.write(`
      <html><head><title>Pay Slip</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',sans-serif;font-size:13px;width:340px;margin:0 auto;padding:24px;color:#1a1a1a}
        .center{text-align:center}.bold{font-weight:600}
        .line{border-top:1.5px dashed #d1d5db;margin:12px 0}
        .row{display:flex;justify-content:space-between;margin:5px 0}
        h2{font-size:17px;margin:4px 0;color:#059669;letter-spacing:0.5px}
        .amount{font-size:20px;color:#059669;font-weight:700}
        .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}
      </style></head><body>
        <div class="center"><h2 class="bold">SALARY PAY SLIP</h2><p style="color:#666;font-size:12px">Khyber Pharmacy</p></div>
        <div class="line"></div>
        <div class="row"><span style="color:#666">Employee</span><span class="bold">${r.employeeName}</span></div>
        <div class="row"><span style="color:#666">Role</span><span>${r.employeeRole || "—"}</span></div>
        <div class="row"><span style="color:#666">Month</span><span>${r.month || "—"}</span></div>
        <div class="row"><span style="color:#666">Date</span><span>${new Date(r.paymentDate).toLocaleDateString("en-PK")}</span></div>
        <div class="line"></div>
        <div class="row"><span style="color:#666">Type</span><span>${r.paymentType}</span></div>
        <div class="row"><span style="color:#666">Method</span><span>${r.paymentMethod}</span></div>
        <div class="row"><span style="color:#666">Status</span><span>${r.status}</span></div>
        <div class="line"></div>
        <div class="row"><span class="amount">AMOUNT</span><span class="amount">Rs. ${(r.amount || 0).toLocaleString()}</span></div>
        <div class="line"></div>
        ${r.notes ? `<p style="margin-top:6px;color:#555">Notes: ${r.notes}</p><div class="line"></div>` : ""}
        <div class="center" style="margin-top:24px"><p style="color:#999">________________</p><p style="font-size:10px;color:#999;margin-top:4px">Authorized Signature</p></div>
        <div class="center" style="margin-top:18px"><p style="font-size:9px;color:#aaa">Generated ${new Date().toLocaleString("en-PK")}</p></div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Salary Ledger Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-PK")}`, 14, 28);
    doc.autoTable({
      startY: 35,
      head: [["Employee","Role","Type","Amount","Date","Method","Month","Status"]],
      body: filtered.map((r) => [
        r.employeeName, r.employeeRole || "—", r.paymentType,
        `Rs. ${(r.amount || 0).toLocaleString()}`,
        fmtDate(r.paymentDate), r.paymentMethod, r.month || "—", r.status,
      ]),
    });
    doc.save("Salary_Ledger_Report.pdf");
  };

  const fmtDate = (d) => { const dt = new Date(d); return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-PK"); };
  const fmtRs = (n) => `Rs. ${(n || 0).toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex h-screen bg-zinc-950">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Toaster position="top-right" />
      <SideBar />
      <div className="flex-1 overflow-auto">

        {/* ─── Header ─── */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Salary & Payments</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Financial ledger for all employee payments</p>
          </div>
          <div className="flex gap-3">
            <button onClick={generateReport} className="btn-secondary text-sm inline-flex items-center gap-2">
              <FiDownload className="text-sm" /> Report
            </button>
            <button
              onClick={openCreate}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg py-2.5 px-5 text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:shadow-emerald-500/30"
            >
              <FiPlus className="text-base" /> Record Payment
            </button>
          </div>
        </div>

        {/* ─── Summary Cards ─── */}
        <div className="grid grid-cols-3 gap-4 px-6 mb-5">
          {[
            { label: "Total Paid (All Time)", value: fmtRs(totals.paid), Icon: FiDollarSign, color: "text-zinc-100", iconBg: "bg-emerald-600/20 text-emerald-400" },
            { label: "This Month", value: fmtRs(totals.thisMonth), Icon: FiCalendar, color: "text-emerald-400", iconBg: "bg-blue-600/20 text-blue-400" },
            { label: "Total Advances", value: fmtRs(totals.advances), Icon: FiTrendingUp, color: "text-amber-400", iconBg: "bg-amber-600/20 text-amber-400" },
          ].map((c) => (
            <div key={c.label} className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${c.iconBg}`}>
                <c.Icon className="text-lg" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">{c.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Invalid Records Banner ─── */}
        {invalidRecords.length > 0 && (
          <div className="mx-6 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="text-amber-400 text-lg flex-shrink-0" />
              <p className="text-amber-300 text-sm">
                <span className="font-semibold">{invalidRecords.length} old record{invalidRecords.length > 1 ? "s" : ""}</span> with missing data found from a previous system version.
              </p>
            </div>
            <button onClick={purgeInvalid} className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg px-4 py-2 transition-colors flex-shrink-0">
              Clean Up
            </button>
          </div>
        )}

        {/* ─── Tabs + Search ─── */}
        <div className="px-6 flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/80">
            {[{ key: "ledger", label: "Payment Ledger" }, { key: "summary", label: "Employee Summary" }].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === t.key ? "bg-emerald-600/20 text-emerald-400 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <input type="text" placeholder="Search payments..." className="input-field w-60 pl-9 py-2 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            <FiSearch className="text-zinc-500 absolute top-1/2 -translate-y-1/2 left-3 text-sm" />
          </div>
        </div>

        {/* ─── Ledger Tab ─── */}
        {tab === "ledger" && (
          <div className="px-6 pb-6">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <FiDollarSign className="text-2xl text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium">No salary records yet</p>
                <p className="text-zinc-600 text-sm mt-1">Click &ldquo;Record Payment&rdquo; to add the first entry</p>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800/80 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800">
                      <th className="table-th">Employee</th>
                      <th className="table-th">Type</th>
                      <th className="table-th text-right">Amount</th>
                      <th className="table-th">Date</th>
                      <th className="table-th">Method</th>
                      <th className="table-th">Month</th>
                      <th className="table-th">Status</th>
                      <th className="table-th text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r._id} className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${initialsColor(r.employeeName)}`}>
                              {initials(r.employeeName)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200">{r.employeeName}</p>
                              <p className="text-xs text-zinc-500">{r.employeeRole || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            r.paymentType === "Advance" ? "bg-amber-500/15 text-amber-400" :
                            r.paymentType === "Bonus" ? "bg-blue-500/15 text-blue-400" :
                            r.paymentType === "Deduction" ? "bg-red-500/15 text-red-400" :
                            r.paymentType === "Overtime" ? "bg-purple-500/15 text-purple-400" :
                            "bg-emerald-500/15 text-emerald-400"
                          }`}>{r.paymentType}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-zinc-100">{fmtRs(r.amount)}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-400">{fmtDate(r.paymentDate)}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{r.paymentMethod}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{r.month || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            r.status === "Paid" ? "bg-emerald-500/15 text-emerald-400" :
                            r.status === "Pending" ? "bg-amber-500/15 text-amber-400" :
                            "bg-red-500/15 text-red-400"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => printPaySlip(r)} className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-blue-400 transition-colors" title="Print">
                              <FiPrinter className="text-sm" />
                            </button>
                            <button onClick={() => openEdit(r)} className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-emerald-400 transition-colors" title="Edit">
                              <FiEdit2 className="text-sm" />
                            </button>
                            <button onClick={() => setDeleteId(r._id)} className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Summary Tab ─── */}
        {tab === "summary" && (
          <div className="px-6 pb-6">
            {summary.length === 0 ? (
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <FiUsers className="text-2xl text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium">No employee summaries</p>
                <p className="text-zinc-600 text-sm mt-1">Summaries appear after recording payments</p>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800/80 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800">
                      <th className="table-th">Employee</th>
                      <th className="table-th text-right">Total Paid</th>
                      <th className="table-th text-right">Advances</th>
                      <th className="table-th text-center">Payments</th>
                      <th className="table-th">Last Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.filter((s) => s.employeeName).map((s) => (
                      <tr key={s._id} className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${initialsColor(s.employeeName)}`}>
                              {initials(s.employeeName)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200">{s.employeeName}</p>
                              <p className="text-xs text-zinc-500">{s.employeeRole || ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400">{fmtRs(s.totalPaid)}</td>
                        <td className="px-4 py-3 text-right text-sm text-amber-400">{fmtRs(s.totalAdvances)}</td>
                        <td className="px-4 py-3 text-center text-sm text-zinc-400">{s.recordCount}</td>
                        <td className="px-4 py-3 text-sm text-zinc-400">{fmtDate(s.lastPayment)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Slide-Over Panel (Create / Edit) ═══ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col animate-[slideInRight_0.25s_ease-out]">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-bold text-zinc-100">
                  {modal === "create" ? "Record Payment" : "Edit Payment"}
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {modal === "create" ? "Add a new salary record" : `Editing: ${form.employeeName}`}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Panel Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto px-6 py-5 space-y-4">
              {/* Employee Select (only on create) */}
              {modal === "create" && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Employee *</label>
                  <select value={form.employeeId} onChange={handleEmployeeSelect} className="input-field w-full" required>
                    <option value="">— Select Employee —</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>{emp.name} — {emp.empRole}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selected employee badge */}
              {form.employeeName && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${initialsColor(form.employeeName)}`}>
                    {initials(form.employeeName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{form.employeeName}</p>
                    <p className="text-xs text-zinc-500">{form.employeeRole || "No role"}</p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Amount (Rs.) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">Rs.</span>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="25,000" min="1" required className="input-field w-full pl-10" />
                </div>
              </div>

              {/* Type + Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Type</label>
                  <select name="paymentType" value={form.paymentType} onChange={handleChange} className="input-field w-full">
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Method</label>
                  <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input-field w-full">
                    {METHODS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Date + Month */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Date</label>
                  <input type="date" name="paymentDate" value={form.paymentDate} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">For Month</label>
                  <select name="month" value={form.month} onChange={handleChange} className="input-field w-full">
                    {monthOpts.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Status Toggle Buttons */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
                <div className="flex gap-2">
                  {STATUSES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.status === s
                          ? s === "Paid" ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400"
                          : s === "Pending" ? "bg-amber-600/20 border-amber-500/50 text-amber-400"
                          : "bg-red-600/20 border-red-500/50 text-red-400"
                          : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:border-zinc-600"
                      }`}
                    >
                      {form.status === s && <FiCheck className="inline mr-1 text-xs" />}{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes</label>
                <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} placeholder="Optional notes..." className="input-field w-full resize-none" />
              </div>
            </form>

            {/* Panel Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 flex gap-3 justify-end">
              <button type="button" onClick={closeModal} className="btn-secondary text-sm">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 px-6 text-sm shadow-lg shadow-emerald-600/20 transition-all"
              >
                {saving ? "Saving..." : modal === "create" ? "Save Payment" : "Update Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Delete Confirmation ═══ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4 mx-auto">
              <FiTrash2 className="text-red-400 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100 text-center">Delete Record?</h3>
            <p className="text-zinc-400 text-sm text-center mt-1 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm flex-1">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
