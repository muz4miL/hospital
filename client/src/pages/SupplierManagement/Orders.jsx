import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSupplyRequests();
  }, []);

  const fetchSupplyRequests = async () => {
    try {
      const response = await axios.get("/api/supplyRequest/read");
      setSupplyRequests(response.data.requests);
      setSearchResults(response.data.requests); // Initialize search results
    } catch (error) {
      console.error("Error fetching supply requests:", error);
      toast.error("Failed to fetch supply requests. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredResults = supplyRequests.filter(
      (request) =>
        request.medicineName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(filteredResults);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteId) {
      try {
        await axios.delete(`/api/supplyRequest/delete/${deleteId}`);
        // Update state to remove the deleted request
        setSupplyRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== deleteId),
        );
        setSearchResults((prevResults) =>
          prevResults.filter((result) => result._id !== deleteId),
        );
        setDeleteId(null);
        toast.success("Supply request deleted successfully!");
      } catch (error) {
        console.error("Error deleting supply request:", error);
        toast.error("Failed to delete supply request.");
      }
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  // Function to generate the report for the Orders page
  const generateReport = () => {
    axios
      .get("/api/supplyRequest/read") // Update with your actual endpoint
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          const requests = data.requests; // Ensure the correct property name

          const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "letter",
          });

          // Document Borders
          const margin = 40;
          doc.setLineWidth(1);
          doc.setDrawColor(0, 90, 139);
          doc.line(30, 30, 580, 30); // Top line
          doc.line(580, 780, 580, 30); // Right line
          doc.line(30, 780, 580, 780); // Bottom line
          doc.line(30, 30, 30, 780); // Left line

          // Title and Subheader
          doc.setFontSize(30);
          doc.text("Supply Request Report", margin, 80);

          doc.setFontSize(15);
          doc.setTextColor(0, 0, 255);
          doc.text(`Total Supply Requests: ${requests.length}`, margin, 130);

          // Table Header and Data
          const tableColumns = [
            "Medicine Name",
            "Quantity",
            "Supplier",
            "Created At",
          ];
          const tableData = requests.map((request) => [
            request.medicineName,
            request.quantity,
            request.supplier,
            formatDate(request.createdAt),
          ]);

          doc.autoTable({
            head: [tableColumns],
            body: tableData,
            startY: 150, // Initial Y-position for the table
            theme: "grid",
            styles: { textColor: [0, 0, 0], fontStyle: "normal", fontSize: 12 },
            columnStyles: {
              0: { fontStyle: "bold" },
              1: { fontStyle: "bold" },
              2: { fontStyle: "bold" },
              3: { fontStyle: "bold" },
            },
          });

          // Save the PDF
          doc.save("SupplyRequestReport.pdf");
        } else {
          console.error("Unexpected response status:", response.status);
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error generating report:", error);
        toast.error("Failed to generate report.");
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Supply Orders
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage supply requests and orders
            </p>
          </div>
          <button
            onClick={generateReport}
            className="btn-secondary text-sm inline-flex items-center"
          >
            <MdDownload className="text-lg mr-2" />
            <span>Download Report</span>
          </button>
        </div>

        <div className="px-6 pt-4">
          <form className="py-2 pb-5 flex justify-end" onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search supply orders"
                className="bg-zinc-800 border border-zinc-700 rounded-lg placeholder-zinc-500 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56 p-2 pl-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="text-zinc-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
            </div>
            <button type="submit" className="btn-primary ml-2 text-sm">
              Search
            </button>
          </form>
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="table-th">Medicine Name</th>
                <th className="table-th">Quantity</th>
                <th className="table-th">Supplier</th>
                <th className="table-th">Created At</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((request) => (
                <tr key={request._id} className="table-row">
                  <td className="table-td">{request.medicineName}</td>
                  <td className="table-td">{request.quantity}</td>
                  <td className="table-td">{request.supplier}</td>
                  <td className="table-td">{request.createdAt}</td>
                  <td className="table-td">
                    <button
                      onClick={() => handleDeleteConfirmation(request._id)}
                      className="bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all rounded px-3 py-1 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {deleteId && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/80 z-50">
            <div className="bg-zinc-900 border border-zinc-700 text-zinc-100 p-8 rounded-xl shadow-xl">
              <p className="text-base font-semibold mb-4">
                Delete this supply request?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleDeleteConfirmed}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
