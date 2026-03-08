import { useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import {
  updateDriverStart,
  updateDriverSuccess,
  updateDriverFailure,
  deleteDriverFailure,
  deleteDriverSuccess,
  signOutDriverStart,
} from "../../redux/driver/driverSlice";
import { useDispatch } from "react-redux";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import DriveNavigationBar from "../../components/DriveNavigationBar";

export default function DriverProfile() {
  const { currentDriver, loading, error } = useSelector(
    (state) => state.driver,
  );
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateDriverStart());
      const res = await fetch(`/api/driver/updatedri/${currentDriver._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateDriverFailure(data.message));
        return;
      }

      dispatch(updateDriverSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateDriverFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutDriverStart());
      const res = await fetch("/api/driver/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteDriverFailure(data.message));
        return;
      }
      dispatch(deleteDriverSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(deleteDriverFailure(data.message));
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      <DriveNavigationBar />
      <div className="p-2 max-w-lg mx-auto">
        <span
          onClick={handleSignOut}
          className="text-zinc-200 cursor-pointer absolute top-15 right-0 mt-2 mr-4 px-4 py-2 bg-red-700/80 hover:bg-red-700 border border-red-900 rounded-lg flex items-center text-sm"
        >
          <FaSignOutAlt className="mr-2" /> Log Out
        </span>
        <h1 className="text-2xl font-semibold text-zinc-100 text-center mt-4">
          Driver Profile
        </h1>
        <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-row gap-16 items-center">
              <label className="text-zinc-400 text-sm font-medium w-32">
                Driver ID
              </label>
              <input
                type="text"
                placeholder="Driver Id"
                defaultValue={currentDriver.driverId}
                id="driverId"
                className="input-field text-sm flex-1 opacity-60 cursor-not-allowed"
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="flex flex-row gap-9 items-center">
              <label className="text-zinc-400 text-sm font-medium w-32">
                Driver Name
              </label>
              <input
                type="text"
                placeholder="Driver Name"
                id="driverName"
                defaultValue={currentDriver.driverName}
                className="input-field text-sm flex-1 opacity-60 cursor-not-allowed"
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="flex flex-row gap-5 items-center">
              <label className="text-zinc-400 text-sm font-medium w-32">
                Driver License
              </label>
              <input
                type="text"
                placeholder="Driver License"
                id="driverLicense"
                defaultValue={currentDriver.driverLicense}
                className="input-field text-sm flex-1 opacity-60 cursor-not-allowed"
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="flex flex-row gap-1 items-center">
              <label className="text-zinc-400 text-sm font-medium w-32">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Phone number"
                defaultValue={currentDriver.contactNo}
                id="contactNo"
                className="input-field text-sm flex-1 opacity-60 cursor-not-allowed"
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="flex flex-row gap-2 items-center">
              <label className="text-zinc-400 text-sm font-medium w-32">
                Vehicle License
              </label>
              <input
                type="text"
                placeholder="Vehicle License"
                defaultValue={currentDriver.vehicleLicense}
                id="vehicleLicense"
                className="input-field text-sm flex-1 opacity-60 cursor-not-allowed"
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="flex flex-row gap-11 items-center">
              <label className="text-zinc-400 text-sm font-medium w-32">
                Availability
              </label>
              <select
                id="availabilty"
                defaultValue={currentDriver.availabilty}
                onChange={handleChange}
                className="input-field text-sm flex-1"
                required
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <button
              disabled={loading}
              className="btn-primary py-3 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Update Profile"}
            </button>
          </form>
        </div>
        <p className="text-red-400 mt-5 text-center text-sm">
          {error ? error : ""}
        </p>
        <p className="text-emerald-400 mt-5 text-center text-sm">
          {updateSuccess ? "Driver updated successfully!" : ""}
        </p>
      </div>
      <Footer />
    </div>
  );
}
