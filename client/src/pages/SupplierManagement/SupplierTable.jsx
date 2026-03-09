import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function SupplierTable() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchSupplier = await axios.get(
        "/api/supplier/read",
      );
      const response = fetchSupplier.data;
      const updatedSupplier = response.supplier.map((promo) => {
        if (new Date(promo.expiredAt) < new Date()) {
          promo.status = "Inactive";
          axios
            .put(`/api/supplier/update/${promo._id}`, {
              status: "Inactive",
            })
            .then((response) => {
              console.log("Supplier status updated:", response);
            })
            .catch((error) => {
              console.error("Error updating Supplier status:", error);
            });
        }
        return promo;
      });
      setData(response);
      setSearchResults(updatedSupplier);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = data.supplier?.filter((elem) => {
      return (
        elem.supplierID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elem.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elem.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elem.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setSearchResults(filtered || []);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(
        `/api/supplier/delete/${deleteId}`,
      );
      setData((prevState) => ({
        ...prevState,
        Supplier: prevState.supplier.filter((promo) => promo._id !== deleteId),
      }));
      setDeleteId(null);
      toast.success("Supplier deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div>
      <div>
        <form
          className="px-6 py-2 pb-5 flex justify-end gap-2"
          onSubmit={handleSearch}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search suppliers..."
              className="input-field w-56 pl-9 py-2 text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            <FaSearch className="text-zinc-500 absolute top-1/2 transform -translate-y-1/2 left-3 text-sm" />
          </div>
          <button type="submit" className="btn-primary text-sm">
            Search
          </button>
        </form>
      </div>
      <div className="px-6 pb-6">
        <div className="rounded-xl border border-zinc-800 overflow-hidden shadow-lg shadow-black/20">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800">
                <th className="table-th">Supplier ID</th>
                <th className="table-th">Supplier</th>
                <th className="table-th">Contact Person</th>
                <th className="table-th">Address</th>
                <th className="table-th">Contact Number</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-zinc-950">
              {searchResults?.map((elem, index) => {
                return (
                  <tr
                    key={index}
                    className="table-row border-b border-zinc-800/60"
                  >
                    <td className="table-td font-mono text-zinc-400 text-xs">
                      {elem.supplierID}
                    </td>
                    <td className="table-td font-medium text-zinc-200">
                      {elem.firstName}
                    </td>
                    <td className="table-td">{elem.lastName}</td>
                    <td className="table-td text-zinc-400">{elem.address}</td>
                    <td className="table-td text-zinc-400">{elem.contactNo}</td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <Link to={`/update-supplier/${elem._id}`}>
                          <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-1 text-xs transition-colors">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteConfirmation(elem._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg px-3 py-1 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {deleteId && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-8 rounded-xl shadow-2xl">
            <p className="text-lg font-semibold mb-2">Delete Supplier?</p>
            <p className="text-zinc-400 text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierTable;
