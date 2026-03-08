import { useState, useEffect, React } from "react";
import SupplierTable from "./SupplierTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function SupplyManagement() {
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [activeSuppliersCount, setActiveSuppliersCount] = useState(0);
  const [inactiveSuppliersCount, setInactiveSuppliersCount] = useState(0);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    fetch("http://localhost:3000/api/supplier/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch suppliers:", response.statusText);
          throw new Error("Failed to fetch suppliers");
        }
      })
      .then((data) => {
        const suppliers = data.supplier;
        setSuppliersCount(suppliers.length);

        const activeSuppliers = suppliers.filter(
          (supplier) => supplier.status === "Active",
        );
        const inactiveSuppliers = suppliers.filter(
          (supplier) => supplier.status === "Inactive",
        );

        setActiveSuppliersCount(activeSuppliers.length);
        setInactiveSuppliersCount(inactiveSuppliers.length);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const generateReport = () => {
    fetch("http://localhost:3000/api/supplier/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to generate report:", response.statusText);
          throw new Error("Failed to generate report");
        }
      })
      .then((data) => {
        const suppliers = data.supplier;

        const doc = new jsPDF();

        const tableHeader = [
          [
            "Supplier ID",
            "Supplier Name",
            "Last Name",
            "NIC",
            "Address",
            "Contact No",
            "Email",
          ],
        ];

        const tableData = suppliers.map((supplier) => [
          supplier.supplierID,
          supplier.firstName,
          supplier.lastName,
          supplier.NIC,
          supplier.address,
          supplier.contactNo,
          supplier.email,
        ]);

        doc.autoTable({
          head: tableHeader,
          body: tableData,
        });

        doc.save("Supplier Management Report.pdf");
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
              Supplier Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage your suppliers and orders
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
              to="/create-supplier"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg inline-flex items-center py-2 px-4 transition text-sm"
            >
              + Add Supplier
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 px-6 mb-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Total Suppliers
            </p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">
              {suppliersCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-emerald-400 text-xs uppercase tracking-wide font-medium">
              Active
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {activeSuppliersCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-700/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide font-medium">
              Inactive
            </p>
            <p className="text-2xl font-bold text-zinc-400 mt-1">
              {inactiveSuppliersCount}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
              All Suppliers
            </h2>
            <Link to="/orders" className="btn-secondary text-sm">
              View Orders →
            </Link>
          </div>
          <SupplierTable />
        </div>
      </div>
    </div>
  );
}
