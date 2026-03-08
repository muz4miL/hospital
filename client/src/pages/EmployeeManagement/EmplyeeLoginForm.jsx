import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signupEmp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/admin-dashboard");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="bg-zinc-950 min-h-screen">
      <NavigationBar />
      <div className="p-3 max-w-md mx-auto mt-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-400 text-2xl font-bold">P</span>
          </div>
          <h1 className="text-2xl text-white font-bold">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Sign in to access the dashboard
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@pharmacy.pk"
                className="bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Password (NIC)
              </label>
              <input
                type="password"
                placeholder="Enter your NIC number"
                className="bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600"
                id="NIC"
                onChange={handleChange}
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </p>
            )}
            <button
              disabled={loading}
              className="bg-emerald-600 text-white p-3 rounded-lg font-medium hover:bg-emerald-500 disabled:opacity-50 transition-all mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="text-center mt-4 mb-8">
          <p className="text-zinc-600 text-sm">
            Forgot password?{" "}
            <span className="text-emerald-400">Contact your manager</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
