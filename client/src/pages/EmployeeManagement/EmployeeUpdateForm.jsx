import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function EmployeeUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    name: "",
    contactNo: "",
    DOB: "",
    address: "",
    email: "",
    NIC: "",
    empRole: "",
    maritalStatus: "",
    gender: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/employee/get/${id}`)
      .then((result) => {
        const employee = result.data.employee;
        employee.DOB = employee.DOB.split("T")[0];
        setEmployeeData(employee);
        y;
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMaritalStatusChange = (e) => {
    const { id, checked } = e.target;
    const newMaritalStatus = checked ? id : "";
    setEmployeeData((prevState) => ({
      ...prevState,
      maritalStatus: newMaritalStatus,
    }));
  };

  const handleGenderChange = (e) => {
    const { id, checked } = e.target;
    const newGender = checked ? id : "";
    setEmployeeData((prevState) => ({
      ...prevState,
      gender: newGender,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3000/api/employee/update/${id}`, employeeData)
      .then(() => {
        toast.success("Updated employee successfully!");
        setTimeout(() => {
          navigate("/employee-management");
        });
      })
      .catch((error) => {
        toast.error("Update employee failed!");
        console.error("Error updating employee:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Update Employee
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Edit employee information
            </p>
          </div>
        </div>
        <div className="mx-6 my-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-10"
          >
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Employee Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                id="name"
                name="name"
                value={employeeData.name}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact No
              </label>
              <input
                type="text"
                placeholder="Enter mobile number"
                id="contactNo"
                name="contactNo"
                value={employeeData.contactNo}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Date of Birth
              </label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={employeeData.DOB}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Address / Description
              </label>
              <textarea
                placeholder="Enter address or description"
                id="address"
                name="address"
                value={employeeData.address}
                onChange={handleChange}
                className="input-field text-sm mb-4 max-h-40 min-h-40"
                required
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Update Employee
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter email"
                id="email"
                name="email"
                value={employeeData.email}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                NIC
              </label>
              <input
                type="text"
                placeholder="Enter NIC"
                id="NIC"
                name="NIC"
                value={employeeData.NIC}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Job Role
              </label>
              <select
                id="empRole"
                name="empRole"
                value={employeeData.empRole}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              >
                <option value="Delivery Manager">Delivery Manager</option>
                <option value="Promotion Manager">Promotion Manager</option>
                <option value="Supplier Manager">Supplier Manager</option>
                <option value="Prescription Manager">
                  Prescription Manager
                </option>
                <option value="Employee Manager">Employee Manager</option>
                <option value="Payment Manager">Payment Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="User Manager">User Manager</option>
              </select>

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Marital Status
              </label>
              <div className="flex gap-6 flex-wrap mb-4">
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleMaritalStatusChange}
                    checked={employeeData.maritalStatus === "Maried"}
                    type="checkbox"
                    name="maritalStatus"
                    id="Maried"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Married</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleMaritalStatusChange}
                    checked={employeeData.maritalStatus === "Unmaried"}
                    type="checkbox"
                    name="maritalStatus"
                    id="Unmaried"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Not Married</span>
                </div>
              </div>

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Gender
              </label>
              <div className="flex gap-6 flex-wrap mb-4">
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleGenderChange}
                    checked={employeeData.gender === "Male"}
                    type="checkbox"
                    name="gender"
                    id="Male"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Male</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleGenderChange}
                    checked={employeeData.gender === "Female"}
                    type="checkbox"
                    name="gender"
                    id="Female"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Female</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
