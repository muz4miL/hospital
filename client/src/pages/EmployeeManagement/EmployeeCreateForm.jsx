import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";

export default function EmployeeCreateForm() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
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

  const handleChange = (e) => {
    const { name, value, type, checked, id } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox"
          ? id === "Male" && checked
            ? "Male"
            : "Female"
          : value,
      maritalStatus:
        name === "maritalStatus"
          ? checked
            ? id
            : ""
          : prevState.maritalStatus,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addEmployee = await axios.post(
        "/api/employee/create",
        value,
      );
      const response = addEmployee.data;
      if (response.success) {
        toast.success(response.message, { duration: 4000 });
        setTimeout(() => {
          navigate("/employee-management");
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(value);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Employee Registration
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Add a new employee to the system
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
                value={value.name}
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
                value={value.contactNo}
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
                value={value.DOB}
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
                value={value.address}
                onChange={handleChange}
                className="input-field text-sm mb-4 max-h-40 min-h-40"
                required
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Register Employee
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
                value={value.email}
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
                value={value.NIC}
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
                value={value.empRole}
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
                    onChange={handleChange}
                    checked={value.maritalStatus === "Maried"}
                    type="checkbox"
                    name="maritalStatus"
                    id="Maried"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Married</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleChange}
                    checked={value.maritalStatus === "Unmaried"}
                    type="checkbox"
                    name="maritalStatus"
                    id="Unmaried"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Unmarried</span>
                </div>
              </div>

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Gender
              </label>
              <div className="flex gap-6 flex-wrap mb-4">
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleChange}
                    checked={value.gender === "Male"}
                    type="checkbox"
                    name="gender"
                    id="Male"
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Male</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    onChange={handleChange}
                    checked={value.gender === "Female"}
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
