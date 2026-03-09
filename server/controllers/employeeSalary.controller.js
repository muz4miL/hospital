import EmployeeSalary from "../models/employeeSalary.model.js";

// Create salary payment
const addEmployeeSalary = async (req, res) => {
  try {
    const { employeeId, employeeName, employeeRole, amount, paymentDate, paymentType, paymentMethod, month, status, notes } = req.body;
    const newRecord = new EmployeeSalary({
      employeeId, employeeName, employeeRole, amount, paymentDate, paymentType, paymentMethod, month, status, notes,
    });
    await newRecord.save();
    res.status(200).json({ success: true, message: "Salary record added!", record: newRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all salary records
const getEmployeeSalary = async (req, res) => {
  try {
    const records = await EmployeeSalary.find().sort({ paymentDate: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get salary records for a specific employee
const getEmployeeSalaryByEmployee = async (req, res) => {
  try {
    const records = await EmployeeSalary.find({ employeeId: req.params.empId }).sort({ paymentDate: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get single record
const getSingleSalary = async (req, res) => {
  try {
    const record = await EmployeeSalary.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found!" });
    res.status(200).json({ success: true, record });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update
const updateEmployeeSalary = async (req, res) => {
  try {
    const updated = await EmployeeSalary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Record not found!" });
    res.status(200).json({ success: true, message: "Updated successfully!", record: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete
const deleteEmployeeSalary = async (req, res) => {
  try {
    const deleted = await EmployeeSalary.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Record not found!" });
    res.status(200).json({ success: true, message: "Deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get summary — total paid per employee
const getSalarySummary = async (req, res) => {
  try {
    const summary = await EmployeeSalary.aggregate([
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: "$employeeId",
          employeeName: { $first: "$employeeName" },
          employeeRole: { $first: "$employeeRole" },
          totalPaid: { $sum: "$amount" },
          totalAdvances: {
            $sum: { $cond: [{ $eq: ["$paymentType", "Advance"] }, "$amount", 0] },
          },
          recordCount: { $sum: 1 },
          lastPayment: { $max: "$paymentDate" },
        },
      },
      { $sort: { employeeName: 1 } },
    ]);
    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete invalid records (missing employeeName from old schema)
const deleteInvalidSalaryRecords = async (req, res) => {
  try {
    const result = await EmployeeSalary.deleteMany({
      $or: [
        { employeeName: { $exists: false } },
        { employeeName: null },
        { employeeName: "" },
      ],
    });
    res.status(200).json({ success: true, message: `Deleted ${result.deletedCount} invalid records`, count: result.deletedCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  addEmployeeSalary,
  getEmployeeSalary,
  getEmployeeSalaryByEmployee,
  getSingleSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
  getSalarySummary,
  deleteInvalidSalaryRecords,
};
