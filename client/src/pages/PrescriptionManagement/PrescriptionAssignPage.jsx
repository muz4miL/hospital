import { useState, useEffect } from "react";
import PrescriptionAssignTable from "./PrescriptionAssignTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PrescriptionManagement() {
  const [prescriptionCount, setPrescriptionsCount] = useState(0);
  const [activePrescriptionsCount, setActivePrescriptionsCount] = useState(0);
  const [inactivePrescriptionsCount, setInactivePrescriptionsCount] =
    useState(0);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = () => {
    fetch("http://localhost:3000/api/prescription/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch prescription:", response.statusText);
          throw new Error("Failed to fetch prescription");
        }
      })
      .then((data) => {
        const prescription = data.prescription;
        setPrescriptionsCount(prescription.length);

        const activePrescriptions = prescription.filter(
          (prescription) => prescription.status === "Active",
        );
        const inactivePrescriptions = prescription.filter(
          (prescription) => prescription.status === "Inactive",
        );

        setActivePrescriptionsCount(activePrescriptions.length);
        setInactivePrescriptionsCount(inactivePrescriptions.length);
      })
      .catch((error) => {
        console.error("Error fetching prescription:", error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const generateReport = () => {
    fetch("http://localhost:3000/api/prescription/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to generate report:", response.statusText);
          throw new Error("Failed to generate report");
        }
      })
      .then((data) => {
        const prescription = data.prescription;

        const doc = new jsPDF();

        const tableHeader = [
          [
            "Prescription ID",
            "First Name",
            "Last Name",
            "Medication Name",
            "Units",
            "Created At",
            "Status",
          ],
        ];

        const tableData = prescription.map((prescription) => [
          prescription.PrescriptionID,
          prescription.firstName,
          prescription.lastName,
          prescription.MedicationNames,
          prescription.units,
          formatDate(prescription.createdAt),
          prescription.status,
        ]);

        doc.autoTable({
          head: tableHeader,
          body: tableData,
        });

        doc.save("Prescription Management Report.pdf");
      })
      .catch((error) => {
        console.error("Error generating report:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Prescription Assignment
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Assign medications to prescriptions — {prescriptionCount} total
            </p>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-3 gap-4 border-b border-zinc-800">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Total Prescriptions</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">
              {prescriptionCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Active</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              {activePrescriptionsCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Inactive</p>
            <p className="text-3xl font-bold text-red-400 mt-1">
              {inactivePrescriptionsCount}
            </p>
          </div>
        </div>
        <PrescriptionAssignTable />
      </div>
    </div>
  );
}
