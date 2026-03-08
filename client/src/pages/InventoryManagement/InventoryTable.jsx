import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function InventoryTable() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchInventory = await axios.get(
        "http://localhost:3000/api/inventory/read",
      );
      const response = fetchInventory.data;
      console.log(response);

      const updatedInventory = await Promise.all(
        response.inventory.map(async (item) => {
          const currentDate = new Date();
          const expirationDate = new Date(item.expirAt);

          if (
            expirationDate <
              new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000) &&
            expirationDate > currentDate
          ) {
            item.status = "Pending to expire";
          } else if (expirationDate > currentDate) {
            item.status = "Active";
          } else {
            item.status = "Expired";
          }

          try {
            await axios.put(
              `http://localhost:3000/api/inventory/update/${item._id}`,
              { status: item.status },
            );
            console.log(`Inventory Item is ${item.status}!`);
          } catch (error) {
            console.error(
              `Error updating Inventory status: ${item.status}`,
              error,
            );
          }

          return item;
        }),
      );

      setData(response);
      setSearchResults(updatedInventory);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    console.log(date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = data?.inventory?.filter((elem) => {
      const nameMatch = elem.Mname.toLowerCase().includes(
        searchQuery.toLowerCase(),
      );
      const statusMatch = elem.status
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const priceMatch = elem.Mprice.toString().includes(searchQuery);
      const supplierMatch = elem.Msupplier.toLowerCase().includes(
        searchQuery.toLowerCase(),
      );
      const typeMatch = elem.type
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const quantityMatch = elem.Mquantity.toString().includes(searchQuery);

      return (
        nameMatch ||
        priceMatch ||
        supplierMatch ||
        typeMatch ||
        quantityMatch ||
        statusMatch
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
        `http://localhost:3000/api/inventory/delete/${deleteId}`,
      );
      setData((prevState) => ({
        ...prevState,
        inventory: prevState.inventory.filter((item) => item._id !== deleteId),
      }));
      setDeleteId(null);
      toast.success("Inventory deleted successfully!");
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
              placeholder="Search medicines..."
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
                <th className="table-th">Medicine Name</th>
                <th className="table-th">Unit Price (Rs.)</th>
                <th className="table-th">Quantity</th>
                <th className="table-th">Supplier</th>
                <th className="table-th">Mfg Date</th>
                <th className="table-th">Expiry Date</th>
                <th className="table-th">Storage</th>
                <th className="table-th">Type</th>
                <th className="table-th">Status</th>
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
                    <td className="table-td font-medium text-zinc-200">
                      {elem.Mname}
                    </td>
                    <td className="table-td">Rs. {elem.Mprice}</td>
                    <td className="table-td">{elem.Mquantity}</td>
                    <td className="table-td text-zinc-400">{elem.Msupplier}</td>
                    <td className="table-td text-zinc-400">
                      {formatDate(elem.manuAt)}
                    </td>
                    <td className="table-td text-zinc-400">
                      {formatDate(elem.expirAt)}
                    </td>
                    <td className="table-td text-zinc-400 max-w-[120px] truncate">
                      {elem.storageCondition}
                    </td>
                    <td className="table-td">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300">
                        {elem.type}
                      </span>
                    </td>
                    <td className="table-td">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${elem.status === "Active" ? "bg-emerald-500/15 text-emerald-400" : elem.status === "Pending to expire" ? "bg-yellow-500/15 text-yellow-400" : "bg-red-500/15 text-red-400"}`}
                      >
                        {elem.status}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <Link to={`/update-inventory/${elem._id}`}>
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
            <p className="text-lg font-semibold mb-2">Delete Medicine?</p>
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

export default InventoryTable;
