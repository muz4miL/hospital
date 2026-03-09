import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function EmployeeLeaveUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    employeeName: "",
    employeeRole: "",
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    totalDays: 1,
    reason: "",
    status: "Pending",
    approvedBy: "",
  });

  useEffect(() => {
    axios
      .get(`/api/employeeLeave/get/${id}`)
      .then((res) => {
        const r = res.data.record;
        setForm({
          employeeName: r.employeeName || "",
          employeeRole: r.employeeRole || "",
          leaveType: r.leaveType || "Casual",
          startDate: r.startDate ? r.startDate.split("T")[0] : "",
          endDate: r.endDate ? r.endDate.split("T")[0] : "",
          totalDays: r.totalDays || 1,
          reason: r.reason || "",
          status: r.status || "Pending",
          approvedBy: r.approvedBy || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Could not load leave record");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "startDate" || name === "endDate") {
        const s = new Date(name === "startDate" ? value : prev.startDate);
        const en = new Date(name === "endDate" ? value : prev.endDate);
        const diff = Math.max(1, Math.ceil((en - s) / 86400000) + 1);
        next.totalDays = diff;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) return toast.error("End date must be after start date");

    try {
      await axios.put(`/api/employeeLeave/update/${id}`, form);
      toast.success("Leave updated!");
      setTimeout(() => navigate("/employee-leave-management"), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

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
      <div className="flex-1 flex items-start justify-center py-10 overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/30 p-8 w-full max-w-xl"
        >
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">Update Leave Record</h2>
          <p className="text-zinc-500 text-sm mb-6">
            {form.employeeName} {form.employeeRole ? `— ${form.employeeRole}` : ""}
          </p>

          {/* Leave Type */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Leave Type</label>
          <select name="leaveType" value={form.leaveType} onChange={handleChange} className="input-field w-full mb-4">
            <option>Casual</option>
            <option>Sick</option>
            <option>Annual</option>
            <option>Emergency</option>
            <option>Unpaid</option>
            <option>Other</option>
          </select>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field w-full" required />
            </div>
          </div>

          {/* Total Days */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Total Days</label>
          <input type="number" value={form.totalDays} readOnly className="input-field w-full mb-4 opacity-60" />

          {/* Reason */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Reason</label>
          <textarea
            name="reason"
            rows={3}
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason for leave..."
            className="input-field w-full mb-4 resize-none"
          />

          {/* Status + Approved By */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field w-full">
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Approved By</label>
              <input type="text" name="approvedBy" value={form.approvedBy} onChange={handleChange} placeholder="Manager name" className="input-field w-full" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate("/employee-leave-management")} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-6 text-sm">
              Update Leave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
