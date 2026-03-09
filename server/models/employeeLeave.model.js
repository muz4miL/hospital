import mongoose from "mongoose";

const employeeLeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeName: { type: String, required: true },
    employeeRole: { type: String },
    leaveType: {
      type: String,
      enum: ["Sick", "Casual", "Annual", "Emergency", "Unpaid", "Other"],
      default: "Casual",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const EmployeeLeave = mongoose.model("EmployeeLeave", employeeLeaveSchema);

export default EmployeeLeave;