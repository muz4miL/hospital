import { useState, useEffect } from "react";
import EmployeeLeaveTable from "./EmployeeLeaveManagementTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function EmployeeManagement() {
  const generateReport = () => {
    fetch("http://localhost:3000/api/employeeLeave/read")
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

        doc.save("Employee Leave Management Report.pdf");
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
              Leave Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage employee leave requests
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
              to="/create-leave-employee"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg inline-flex items-center py-2 px-4 transition text-sm"
            >
              + Add Leave
            </Link>
          </div>
        </div>
        <div className="px-6 pb-6">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            All Leave Records
          </h2>
          <EmployeeLeaveTable />
        </div>
      </div>
    </div>
  );
}
