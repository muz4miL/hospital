import { useState, useEffect } from "react";
import EmployeeTable from "./EmployeeManagementTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function EmployeeManagement() {
  const generateReport = () => {
    fetch("/api/employee/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to generate report:", response.statusText);
          throw new Error("Failed to generate report");
        }
      })
      .then((data) => {
        const employees = data.employee;

        const doc = new jsPDF();

        const tableHeader = [
          [
            "Name",
            "Phone",
            "DOB",
            "Email",
            "NIC",
            "Role",
            "Marital Status",
            "Gender",
          ],
        ];

        const tableData = employees.map((employee) => [
          employee.name,
          employee.contactNo,
          formatDate(employee.DOB),
          employee.email,
          employee.NIC,
          employee.empRole,
          employee.maritalStatus,
          employee.gender,
        ]);

        doc.autoTable({
          head: tableHeader,
          body: tableData,
        });

        doc.save("Employee Management Report.pdf");
      })
      .catch((error) => {
        console.error("Error generating report:", error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Employee Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage your pharmacy staff
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generateReport}
              className="btn-secondary text-sm inline-flex items-center"
            >
              <MdDownload className="text-lg mr-2" />
              <span>Download Report</span>
            </button>
            <Link
              to="/create-employee"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg inline-flex items-center py-2 px-4 transition text-sm"
            >
              + Add Employee
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 px-6 mb-4">
          <Link
            to="/employee-salary-management"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20 hover:border-emerald-500/30 transition-colors"
          >
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Salary Records
            </p>
            <p className="text-sm font-medium text-emerald-400 mt-2">
              Manage Salary →
            </p>
          </Link>
          <Link
            to="/employee-leave-management"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20 hover:border-emerald-500/30 transition-colors"
          >
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Leave Requests
            </p>
            <p className="text-sm font-medium text-emerald-400 mt-2">
              Manage Leave →
            </p>
          </Link>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Quick Actions
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              Use the table below to edit staff
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            All Employees
          </h2>
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
}
