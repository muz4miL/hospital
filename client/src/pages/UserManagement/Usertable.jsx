import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function Usertable() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", email: "", phonenumber: "", role: "Admin" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchuser = await axios.get("/api/user/read");
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
        `/api/user/deleteall/${deleteId}`,
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

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ username: user.username, email: user.email, phonenumber: user.phonenumber || "", role: user.role || "Admin" });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/user/admin-update/${editUser._id}`, editForm);
      toast.success("User updated!");
      setEditUser(null);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
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
                <th className="table-th">Role</th>
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
                    <td className="table-td">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        elem.role === "Admin" ? "bg-red-500/10 text-red-400" :
                        elem.role === "Manager" ? "bg-blue-500/10 text-blue-400" :
                        elem.role === "Cashier" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-zinc-500/10 text-zinc-400"
                      }`}>{elem.role || "Admin"}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(elem)}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg px-3 py-1 text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(elem._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg px-3 py-1 text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <FiTrash2 /> Delete
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
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleEditSave} className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">Edit User</h2>
            <p className="text-zinc-500 text-sm mb-5">Update access credentials and role</p>

            <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
            <input type="text" value={editForm.username} onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} className="input-field w-full mb-3" required />

            <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
            <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="input-field w-full mb-3" required />

            <label className="block text-sm font-medium text-zinc-300 mb-1">Phone</label>
            <input type="text" value={editForm.phonenumber} onChange={(e) => setEditForm((f) => ({ ...f, phonenumber: e.target.value }))} className="input-field w-full mb-3" />

            <label className="block text-sm font-medium text-zinc-300 mb-1">Role</label>
            <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} className="input-field w-full mb-5">
              <option>Admin</option>
              <option>Manager</option>
              <option>Cashier</option>
              <option>Viewer</option>
            </select>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditUser(null)} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-5 text-sm">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
