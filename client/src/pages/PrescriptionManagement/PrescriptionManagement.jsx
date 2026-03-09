import { useState, useEffect } from "react";
import PrescriptionTable from "./PrescriptionTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PrescriptionManagement() {
  const [prescriptionCount, setPrescriptionCount] = useState(0);
  const [activePrescriptionCount, setActivePrescriptionCount] = useState(0);
  const [inactivePrescriptionCount, setInactivePrescriptionCount] = useState(0);

  useEffect(() => {
    fetchPrescription();
  }, []);

  const fetchPrescription = () => {
    fetch("/api/prescription/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch Prescription:", response.statusText);
          throw new Error("Failed to fetch prescription");
        }
      })
      .then((data) => {
        const Prescription = data.prescription;
        setPrescriptionCount(Prescription.length);

        const activePrescription = Prescription.filter(
          (prescription) => prescription.status === "Active",
        );
        const inactivePrescription = Prescription.filter(
          (prescription) => prescription.status === "Inactive",
        );

        setActivePrescriptionCount(activePrescription.length);
        setInactivePrescriptionCount(inactivePrescription.length);
      })
      .catch((error) => {
        console.error("Error fetching Prescription:", error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const generateReport = () => {
    fetch("/api/prescription/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to generate report:", response.statusText);
          throw new Error("Failed to generate report");
        }
      })
      .then((data) => {
        const prescriptions = data.prescription;

        const doc = new jsPDF();

        const totalPrescriptions = prescriptions.length;

        // Adding counts to the report
        doc.text(`Total Prescriptions: ${totalPrescriptions}`, 20, 20);

        // Adding prescription details as a table
        const tableHeader = [
          [
            "Prescription ID",
            "First Name",
            "Last Name",
            "Age",
            "Contact No",
            "Medication Names",
            "Units",
            "Notes",
          ],
        ];
        const tableData = prescriptions.map((prescription) => [
          prescription.PrescriptionID,
          prescription.firstName,
          prescription.lastName,
          prescription.age,
          prescription.contactNo,
          prescription.MedicationNames,
          prescription.units,
          prescription.notes,
        ]);

        doc.autoTable({
          head: tableHeader,
          body: tableData,
          startY: 25,
        });

        doc.save("PrescriptionManagementReport.pdf");
      })
      .catch((error) => {
        console.error("Error generating report:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Prescription Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage patient prescriptions
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
              to="/create-prescription"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg inline-flex items-center py-2 px-4 transition text-sm"
            >
              + New Prescription
            </Link>
          </div>
        </div>
        <div className="flex gap-3 px-6 mb-4">
          <Link to="/prescription-assign" className="btn-secondary text-sm">
            Assign Prescription →
          </Link>
          <Link to="/inventory-management" className="btn-secondary text-sm">
            Check Inventory →
          </Link>
          <Link to="/user-payment" className="btn-secondary text-sm">
            Check Payment →
          </Link>
        </div>
        <div className="px-6 pb-6">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
            All Prescriptions ({prescriptionCount})
          </h2>
          <PrescriptionTable />
        </div>
      </div>
    </div>
  );
}
