import mongoose from "mongoose";

const employeeSalarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeName: { type: String, required: true },
    employeeRole: { type: String },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentType: {
      type: String,
      enum: ["Monthly Salary", "Advance", "Bonus", "Overtime", "Deduction"],
      default: "Monthly Salary",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "JazzCash", "EasyPaisa", "Cheque"],
      default: "Cash",
    },
    month: { type: String }, // e.g. "March 2026"
    status: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled"],
      default: "Paid",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const EmployeeSalary = mongoose.model("EmployeeSalary", employeeSalarySchema);

export default EmployeeSalary;
