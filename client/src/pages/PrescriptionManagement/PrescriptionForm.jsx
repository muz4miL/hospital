import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

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
        "/api/prescription/create",
        value,
      );
      const response = addPrescription.data;
      if (response.success) {
        console.log(response.message);
        toast.success(response.message, { duration: 4000 });

        setTimeout(() => {
          navigate("/payment"); //payment page needed here  for customer to proceed with payment
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(value);
  };

  return (
    <div className="flex justify-center">
      <div className="flex-1 bg-zinc-950 min-h-screen">
        <div className="bg-zinc-900 justify-between flex px-10 py-8">
          <h1 className="text-4xl font-bold text-emerald-400">
            Prescription Form
          </h1>
        </div>
        <div className="p-10 bg-zinc-900 m-10 rounded-xl max-w-4xl border border-zinc-800 shadow-lg shadow-black/20">
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
                placeholder="Enter Prescription ID"
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
                placeholder="Enter First Name"
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
                placeholder="Enter Last Name"
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
                placeholder="Enter Age"
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
                placeholder="Enter Contact Number"
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
                Submit
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Medication Name
              </label>
              <textarea
                type="textarea"
                placeholder="Enter Medication Name"
                id="MedicationNames"
                name="MedicationNames"
                value={value.MedicationNames}
                onChange={handleChange}
                className="input-field text-sm mb-4"
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
                type="textarea"
                placeholder="Enter notes"
                id="notes"
                name="notes"
                value={value.notes}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
