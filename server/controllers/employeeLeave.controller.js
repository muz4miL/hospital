import EmployeeLeave from "../models/employeeLeave.model.js";

const addEmpoyeeLeave = async (req, res) => {
  try {
    const { employeeId, employeeName, employeeRole, leaveType, startDate, endDate, totalDays, reason, status, approvedBy } = req.body;
    const newLeave = new EmployeeLeave({
      employeeId, employeeName, employeeRole, leaveType, startDate, endDate, totalDays, reason, status, approvedBy,
    });
    await newLeave.save();
    res.status(200).json({ success: true, message: "Leave added successfully!", newLeave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getEmployeeLeave = async (req, res) => {
  try {
    const records = await EmployeeLeave.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateEmployeeLeave = async (req, res) => {
  try {
    const updated = await EmployeeLeave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Leave not found!" });
    res.status(200).json({ success: true, message: "Leave Updated Successfully!", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteEmployeeLeave = async (req, res) => {
  try {
    const deleted = await EmployeeLeave.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Leave not found!" });
    res.status(200).json({ success: true, message: "Leave Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUpdateEmployeeLeave = async (req, res) => {
  try {
    const record = await EmployeeLeave.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Leave not found!" });
    res.status(200).json({ success: true, record });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addEmpoyeeLeave, getEmployeeLeave, updateEmployeeLeave, deleteEmployeeLeave, getUpdateEmployeeLeave };