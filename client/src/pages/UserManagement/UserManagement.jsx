import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdDownload } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import SideBar from "../../components/SideBar";
import UserTable from "./Usertable";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function UserManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const [userCount, setUserCount] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phonenumber: "",
    address: "",
    password: "",
    role: "Cashier",
  });

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const res = await axios.get("/api/user/read");
      setUserCount(res.data.user?.length || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error("Fill required fields");
    setCreating(true);
    try {
      await axios.post("/api/auth/signup", form);
      toast.success("User created!");
      setForm({ username: "", email: "", phonenumber: "", address: "", password: "", role: "Cashier" });
      setShowCreate(false);
      fetchCount();
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Creation failed");
    }
    setCreating(false);
  };

  const generateReport = () => {
    axios.get("/api/user/read").then((res) => {
      const users = res.data.user || [];
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("User Management Report", 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-PK")}`, 14, 28);
      doc.autoTable({
        startY: 35,
        head: [["Username", "Email", "Phone", "Role"]],
        body: users.map((u) => [u.username, u.email, u.phonenumber, u.role || "Admin"]),
      });
      doc.save("User_Report.pdf");
    });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Toaster position="top-right" />
      <SideBar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">User Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage system users and access roles</p>
          </div>
          <div className="flex gap-3">
            <button onClick={generateReport} className="btn-secondary text-sm inline-flex items-center">
              <MdDownload className="text-base mr-2" /> Download Report
            </button>
            <button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-4 text-sm inline-flex items-center">
              <FiUserPlus className="mr-2" /> Create User
            </button>
          </div>
        </div>

        {/* Current Login + Stats */}
        <div className="grid grid-cols-3 gap-4 px-6 mb-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20 col-span-2">
            <p className="text-zinc-500 text-xs uppercase tracking-wide mb-3">Current Login</p>
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-emerald-500/50 object-cover"
              />
              <div>
                <p className="text-zinc-100 font-semibold text-lg">{currentUser?.username || "—"}</p>
                <p className="text-zinc-400 text-sm">{currentUser?.email || "—"}</p>
              </div>
              <div className="ml-auto text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentUser?.role === "Admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  currentUser?.role === "Manager" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>{currentUser?.role || "Admin"}</span>
                <p className="text-zinc-500 text-xs mt-1">Phone: {currentUser?.phonenumber || "—"}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Total Users</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">{userCount}</p>
          </div>
        </div>

        {/* User Table */}
        <div className="pb-6">
          <UserTable />
        </div>
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">Create New User</h2>
            <p className="text-zinc-500 text-sm mb-5">Set up access credentials and role</p>

            <label className="block text-sm font-medium text-zinc-300 mb-1">Username *</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} className="input-field w-full mb-3" required />

            <label className="block text-sm font-medium text-zinc-300 mb-1">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field w-full mb-3" required />

            <label className="block text-sm font-medium text-zinc-300 mb-1">Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field w-full mb-3" required minLength={6} />

            <label className="block text-sm font-medium text-zinc-300 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="input-field w-full mb-5">
              <option>Admin</option>
              <option>Manager</option>
              <option>Cashier</option>
              <option>Viewer</option>
            </select>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" disabled={creating} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-5 text-sm disabled:opacity-50">
                {creating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
