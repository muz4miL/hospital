import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInDriverStart,
  signInDriverSuccess,
  signInDriverFailure,
} from "../../redux/driver/driverSlice";
import DriveNavigationBar from "../../components/DriveNavigationBar";
import Footer from "../../components/Footer";

export default function DriverSignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.driver);
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
      dispatch(signInDriverStart());
      const res = await fetch("/api/driver/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInDriverFailure(data.message));
        return;
      }
      dispatch(signInDriverSuccess(data));
      navigate("/driver-profile");
    } catch (error) {
      dispatch(signInDriverFailure(error.message));
    }
  };
  return (
    <div className="bg-zinc-950 min-h-screen">
      <DriveNavigationBar />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-2xl text-center font-semibold my-7 text-zinc-100">
          Driver Sign In
        </h1>
        <div className="p-8 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Driver ID"
              className="input-field"
              id="driverId"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              id="password"
              onChange={handleChange}
            />

            <button
              disabled={loading}
              className="btn-primary py-3 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>

        {error && (
          <p className="text-red-400 mt-5 text-sm text-center">{error}</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
