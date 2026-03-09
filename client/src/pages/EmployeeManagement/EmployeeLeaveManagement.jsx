import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import SideBar from "../../components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function EmployeeLeaveManagement() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get("/api/employeeLeave/read");
      setRecords(res.data.records || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filtered = records.filter(
    (r) =>
      r.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      r.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
      r.status?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: records.length,
    pending: records.filter((r) => r.status === "Pending").length,
    approved: records.filter((r) => r.status === "Approved").length,
    rejected: records.filter((r) => r.status === "Rejected").length,
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/employeeLeave/delete/${deleteId}`);
      setDeleteId(null);
      toast.success("Leave deleted");
      fetchAll();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee Leave Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-PK")}`, 14, 28);
    doc.autoTable({
      startY: 35,
      head: [["Employee", "Type", "From", "To", "Days", "Status"]],
      body: records.map((r) => [
        r.employeeName,
        r.leaveType,
        new Date(r.startDate).toLocaleDateString("en-PK"),
        new Date(r.endDate).toLocaleDateString("en-PK"),
        r.totalDays,
        r.status,
      ]),
    });
    doc.save("Employee_Leave_Report.pdf");
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-PK");

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
        {/* Header */}
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Leave Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Track all employee leave records</p>
          </div>
          <div className="flex gap-3">
            <button onClick={generateReport} className="btn-secondary text-sm inline-flex items-center">
              <MdDownload className="text-base mr-2" /> Download Report
            </button>
            <Link to="/create-leave-employee" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-4 text-sm">
              + Add Leave
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 px-6 mb-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{stats.total}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Approved</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Rejected</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.rejected}</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 flex justify-end mb-4">
          <div className="relative">
            <input type="text" placeholder="Search..." className="input-field w-56 pl-9 py-2 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            <FiSearch className="text-zinc-500 absolute top-1/2 transform -translate-y-1/2 left-3 text-sm" />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-zinc-800 overflow-hidden shadow-lg shadow-black/20">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800">
                  <th className="table-th">Employee</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Type</th>
                  <th className="table-th">From</th>
                  <th className="table-th">To</th>
                  <th className="table-th">Days</th>
                  <th className="table-th">Reason</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-950">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-zinc-500">No leave records found</td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r._id} className="table-row border-b border-zinc-800/60">
                      <td className="table-td font-medium text-zinc-200">{r.employeeName}</td>
                      <td className="table-td text-zinc-400 text-xs">{r.employeeRole || "—"}</td>
                      <td className="table-td">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          r.leaveType === "Sick" ? "bg-red-500/10 text-red-400" :
                          r.leaveType === "Emergency" ? "bg-orange-500/10 text-orange-400" :
                          r.leaveType === "Unpaid" ? "bg-zinc-500/10 text-zinc-400" :
                          "bg-blue-500/10 text-blue-400"
                        }`}>{r.leaveType}</span>
                      </td>
                      <td className="table-td text-zinc-400">{fmtDate(r.startDate)}</td>
                      <td className="table-td text-zinc-400">{fmtDate(r.endDate)}</td>
                      <td className="table-td text-zinc-300">{r.totalDays}</td>
                      <td className="table-td text-zinc-400 text-xs max-w-[150px] truncate">{r.reason || "—"}</td>
                      <td className="table-td">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          r.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" :
                          r.status === "Pending" ? "bg-amber-500/10 text-amber-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>{r.status}</span>
                      </td>
                      <td className="table-td">
                        <div className="flex gap-1">
                          <Link to={`/update-leave-employee/${r._id}`}>
                            <button className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded px-2 py-1 text-xs">Edit</button>
                          </Link>
                          <button onClick={() => setDeleteId(r._id)} className="bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded px-2 py-1 text-xs">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-8 rounded-xl shadow-2xl">
            <p className="text-lg font-semibold mb-2">Delete Leave Record?</p>
            <p className="text-zinc-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
