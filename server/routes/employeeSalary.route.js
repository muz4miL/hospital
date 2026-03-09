import express from "express";
import {
  addEmployeeSalary,
  getEmployeeSalary,
  getEmployeeSalaryByEmployee,
  getSingleSalary,
  updateEmployeeSalary,
  deleteEmployeeSalary,
  getSalarySummary,
  deleteInvalidSalaryRecords,
} from "../controllers/employeeSalary.controller.js";

const routers = express.Router();

routers.post("/create", addEmployeeSalary);
routers.get("/read", getEmployeeSalary);
routers.get("/summary", getSalarySummary);
routers.get("/employee/:empId", getEmployeeSalaryByEmployee);
routers.get("/get/:id", getSingleSalary);
routers.put("/update/:id", updateEmployeeSalary);
routers.delete("/delete/:id", deleteEmployeeSalary);
routers.delete("/purge-invalid", deleteInvalidSalaryRecords);

export default routers;
