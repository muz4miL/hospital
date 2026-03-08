import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";

export default function PrescriptionCreateForm() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    prescriptionID: "",
    firstname: "",
    lastname: "",
    age: "",
    contactNo: "",
    MedicationNames: "",
    units: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = value;

    // Validate PrescriptionID
    if (name === "PrescriptionID") {
      // Check if the value does not start with 'P'
      if (!value.startsWith("P")) {
        toast.error('Prescription ID must start with "P"', { duration: 4000 });
        return;
      }
    }

    // Validate contactNo
    if (name === "contactNo") {
      // Check if the value is empty or contains only numeric characters
      if (value && !/^\d+$/.test(value)) {
        toast.error("Contact number must contain only numeric characters", {
          duration: 4000,
        });
        return;
      }
      // Check if the length exceeds 10 digits
      if (value.length > 10) {
        toast.error("Contact number cannot exceed 10 digits", {
          duration: 4000,
        });
        return;
      }
    }

    setValue((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox" ? (checked ? "Active" : "Inactive") : updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addPrescription = await axios.post(
        "http://localhost:3000/api/prescription/create",
        value,
      );
      const response = addPrescription.data;
      if (response.success) {
        toast.success(response.message, { duration: 4000 });
        setTimeout(() => {
          navigate("/Prescription-management");
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
              New Prescription
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Add a new prescription record
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
                Prescription ID
              </label>
              <input
                type="text"
                placeholder="Enter Prescription ID (starts with P)"
                id="PrescriptionID"
                name="PrescriptionID"
                value={value.PrescriptionID}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                id="firstName"
                name="firstName"
                value={value.firstName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                id="lastName"
                name="lastName"
                value={value.lastName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Age
              </label>
              <input
                type="text"
                placeholder="Enter age"
                id="age"
                name="age"
                value={value.age}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Enter contact number"
                id="contactNo"
                name="contactNo"
                value={value.contactNo}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Create Prescription
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Medication Name(s)
              </label>
              <textarea
                placeholder="Enter medication names"
                id="MedicationNames"
                name="MedicationNames"
                value={value.MedicationNames}
                onChange={handleChange}
                className="input-field text-sm mb-4 min-h-28"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Units
              </label>
              <input
                type="text"
                placeholder="Enter units"
                id="units"
                name="units"
                value={value.units}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Notes
              </label>
              <textarea
                placeholder="Enter additional notes"
                id="notes"
                name="notes"
                value={value.notes}
                onChange={handleChange}
                className="input-field text-sm mb-4 min-h-24"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
