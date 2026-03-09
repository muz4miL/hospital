import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function PrescriptionViewDetails() {
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
    notes: "",
  });

  useEffect(() => {
    axios
      .get(`/api/prescription/get/${id}`)
      .then((result) => {
        const prescription = result.data.prescription;

        //prescription.createdAt = prescription.createdAt.split('T')[0];
        //prescription.expiredAt = prescription.expiredAt.split('T')[0];
        setPrescriptionData(prescription);

        console.log(prescription);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Prescription Details
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              View prescription information
            </p>
          </div>
        </div>
        <div className="mx-6 my-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-4xl">
          <form className="flex flex-col sm:flex-row gap-10">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Prescription ID
              </label>
              <input
                type="text"
                id="PrescriptionID"
                name="PrescriptionID"
                value={prescriptionData.PrescriptionID}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={prescriptionData.firstName}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={prescriptionData.lastName}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Age
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={prescriptionData.age}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact Number
              </label>
              <input
                type="text"
                id="contactNo"
                name="contactNo"
                value={prescriptionData.contactNo}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Medication Name(s)
              </label>
              <textarea
                id="MedicationNames"
                name="MedicationNames"
                value={prescriptionData.MedicationNames}
                className="input-field text-sm mb-4 min-h-24 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Units
              </label>
              <input
                type="text"
                id="units"
                name="units"
                value={prescriptionData.units}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={prescriptionData.notes}
                className="input-field text-sm mb-4 min-h-24 opacity-60 cursor-not-allowed"
                readOnly
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
