import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function EmployeeSalaryUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    employeeName: "",
    employeeRole: "",
    amount: "",
    paymentDate: "",
    paymentType: "Monthly Salary",
    paymentMethod: "Cash",
    month: "",
    status: "Paid",
    notes: "",
  });

  useEffect(() => {
    axios
      .get(`/api/employeeSalary/get/${id}`)
      .then((res) => {
        const r = res.data.record;
        setForm({
          employeeName: r.employeeName || "",
          employeeRole: r.employeeRole || "",
          amount: r.amount || "",
          paymentDate: r.paymentDate ? r.paymentDate.split("T")[0] : "",
          paymentType: r.paymentType || "Monthly Salary",
          paymentMethod: r.paymentMethod || "Cash",
          month: r.month || "",
          status: r.status || "Paid",
          notes: r.notes || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Could not load record");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");

    try {
      await axios.put(`/api/employeeSalary/update/${id}`, {
        ...form,
        amount: Number(form.amount),
      });
      toast.success("Record updated!");
      setTimeout(() => navigate("/employee-salary-management"), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const currentYear = new Date().getFullYear();
  const monthOptions = [];
  for (let y = currentYear; y >= currentYear - 1; y--) {
    MONTHS.forEach((m) => monthOptions.push(`${m} ${y}`));
  }

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
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">Update Payment Record</h2>
          <p className="text-zinc-500 text-sm mb-6">
            {form.employeeName} {form.employeeRole ? `— ${form.employeeRole}` : ""}
          </p>

          {/* Amount */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Amount (Rs.) *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="input-field w-full mb-4"
            min="1"
            required
          />

          {/* Row: Type + Method */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Payment Type</label>
              <select name="paymentType" value={form.paymentType} onChange={handleChange} className="input-field w-full">
                <option>Monthly Salary</option>
                <option>Advance</option>
                <option>Bonus</option>
                <option>Overtime</option>
                <option>Deduction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input-field w-full">
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>JazzCash</option>
                <option>EasyPaisa</option>
                <option>Cheque</option>
              </select>
            </div>
          </div>

          {/* Row: Date + Month */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Payment Date</label>
              <input type="date" name="paymentDate" value={form.paymentDate} onChange={handleChange} className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">For Month</label>
              <select name="month" value={form.month} onChange={handleChange} className="input-field w-full">
                {monthOptions.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field w-full mb-4">
            <option>Paid</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>

          {/* Notes */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes..."
            className="input-field w-full mb-6 resize-none"
          />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/employee-salary-management")}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-6 text-sm"
            >
              Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
