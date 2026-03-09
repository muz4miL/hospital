import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function EmployeeSalaryCreateForm() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    employeeName: "",
    employeeRole: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentType: "Monthly Salary",
    paymentMethod: "Cash",
    month: `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
    status: "Paid",
    notes: "",
  });

  useEffect(() => {
    axios
      .get("/api/employee/read")
      .then((res) => setEmployees(res.data.employee || []))
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const handleEmployeeSelect = (e) => {
    const emp = employees.find((x) => x._id === e.target.value);
    if (emp) {
      setForm((f) => ({
        ...f,
        employeeId: emp._id,
        employeeName: emp.name,
        employeeRole: emp.empRole || "",
      }));
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeId) return toast.error("Select an employee");
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");

    try {
      await axios.post("/api/employeeSalary/create", {
        ...form,
        amount: Number(form.amount),
      });
      toast.success("Payment recorded!");
      setTimeout(() => navigate("/employee-salary-management"), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record payment");
    }
  };

  const currentYear = new Date().getFullYear();
  const monthOptions = [];
  for (let y = currentYear; y >= currentYear - 1; y--) {
    MONTHS.forEach((m) => monthOptions.push(`${m} ${y}`));
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
          <h2 className="text-xl font-semibold text-zinc-100 mb-1">Record Salary Payment</h2>
          <p className="text-zinc-500 text-sm mb-6">Fill in the payment details below</p>

          {/* Employee */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Employee *</label>
          <select
            value={form.employeeId}
            onChange={handleEmployeeSelect}
            className="input-field w-full mb-4"
            required
          >
            <option value="">— Select Employee —</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} — {emp.empRole}
              </option>
            ))}
          </select>

          {/* Amount */}
          <label className="block text-sm font-medium text-zinc-300 mb-1">Amount (Rs.) *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 25000"
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
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
