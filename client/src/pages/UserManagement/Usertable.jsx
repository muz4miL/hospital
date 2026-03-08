import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import axios from "axios";
import toast from "react-hot-toast";

export default function Usertable() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchuser = await axios.get("http://localhost:3000/api/user/read");
      const response = fetchuser.data;
      const updatedusers = response.user;
      console.log(response);

      setData(response);
      setSearchResults(updatedusers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = data.user?.filter((elem) => {
      return (
        elem.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elem.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        `http://localhost:3000/api/user/deleteall/${deleteId}`,
      );
      setData((prevState) => ({
        ...prevState,
        user: prevState.user.filter((promo) => promo._id !== deleteId),
      }));
      setDeleteId(null);
      toast.success("User deleted successfully!");
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
              placeholder="Search users..."
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
                <th className="table-th">Username</th>
                <th className="table-th">Email</th>
                <th className="table-th">Phone Number</th>
                <th className="table-th">Address</th>
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
                      {elem.username}
                    </td>
                    <td className="table-td text-zinc-400">{elem.email}</td>
                    <td className="table-td text-zinc-400">
                      {elem.phonenumber}
                    </td>
                    <td className="table-td text-zinc-400">{elem.address}</td>
                    <td className="table-td">
                      <button
                        onClick={() => handleDeleteConfirmation(elem._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg px-3 py-1 text-xs transition-colors"
                      >
                        Delete
                      </button>
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
            <p className="text-lg font-semibold mb-2">Delete User?</p>
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
