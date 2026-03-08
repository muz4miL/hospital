import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function PrescriptionAssignForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prescriptionData, setPrescriptionData] = useState({
    PrescriptionID: "",
    firstName: "",
    lastName: "",
    age: "",
    contactNo: "",
    MedicationNames: "",
    units: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/prescription/get/${id}`)
      .then((result) => {
        const prescription = result.data.prescription;

        prescription.createdAt = prescription.createdAt.split("T")[0];
        setPrescriptionData(prescription);

        console.log(prescription);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { id } = e.target;
    const newStatus = id === "Ashen" ? "Ashen" : "Kavindu";
    setPrescriptionData((prevState) => ({
      ...prevState,
      status: newStatus,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        `http://localhost:3000/api/prescription/update/${id}`,
        prescriptionData,
      )
      .then(() => {
        toast.success("Prescription Assigned successfully!");
        setTimeout(() => {
          navigate("/prescription-assign");
        });
      })
      .catch((error) => {
        toast.error("Prescription assign failed!");
        console.error("Error assigning prescription:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Assign Medications
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Assign medications to a prescription
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
                placeholder="Enter Prescription ID"
                id="PrescriptionID"
                name="PrescriptionID"
                value={prescriptionData.PrescriptionID}
                onChange={handleChange}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                id="firstName"
                name="firstName"
                value={prescriptionData.firstName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                id="lastName"
                name="lastName"
                value={prescriptionData.lastName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Age
              </label>
              <input
                type="text"
                placeholder="Enter age"
                id="age"
                name="age"
                value={prescriptionData.age}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Enter contact number"
                id="contactNo"
                name="contactNo"
                value={prescriptionData.contactNo}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Assign Prescription
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Medication Name(s)
              </label>
              <input
                type="text"
                placeholder="Enter medication name"
                id="MedicationNames"
                name="MedicationNames"
                value={prescriptionData.MedicationNames}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Units
              </label>
              <input
                type="text"
                placeholder="Enter units"
                id="units"
                name="units"
                value={prescriptionData.units}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Created Date
              </label>
              <input
                type="date"
                id="createdAt"
                name="createdAt"
                value={prescriptionData.createdAt}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Notes
              </label>
              <textarea
                placeholder="Enter notes"
                id="notes"
                name="notes"
                value={prescriptionData.notes}
                onChange={handleChange}
                className="input-field text-sm mb-4 min-h-24"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Assign To
              </label>
              <div className="flex gap-6 flex-wrap mb-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="status"
                    id="Ashen"
                    checked={prescriptionData.status === "Ashen"}
                    onChange={handleStatusChange}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Ashen</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="status"
                    id="Kavindu"
                    checked={prescriptionData.status === "Kavindu"}
                    onChange={handleStatusChange}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Kavindu</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
