import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";

export default function DriverUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driverData, setDriverData] = useState({
    driverId: "",
    driverName: "",
    driverLicense: "",
    vehicleModel: "",
    availabilty: "",
    contactNo: "",
    vehicleLicense: "",
    licenseValidity: "",
    password: "",
  });

  useEffect(() => {
    getdriverByID();
  }, [id]);

  const getdriverByID = async () => {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/driver/get/${id}`,
      );
      const driver = result.data.driver;
      setDriverData(driver);

      console.log(driver);
    } catch (error) {
      console.log(error);
    }
  };

  const [errors, setErrors] = useState({
    driverId: "",
    driverLicense: "",
    contactNo: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let error = "";

    if (name === "contactNo" && value.charAt(0) === "0") {
      error = "Enter the contact number without initial zero";
    } else if (name === "driverLicense" && value.length !== 8) {
      error = "Driver license should be 8 digits long";
    } else if (
      name === "password" &&
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)
    ) {
      error =
        "Password should contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setDriverData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleValidityChange = (e) => {
    const { id } = e.target;
    const newValidity = id === "Valid" ? "Valid" : "Expired";
    setDriverData((prevState) => ({
      ...prevState,
      licenseValidity: newValidity,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = Object.entries(errors).filter(
      ([, error]) => error !== "",
    );

    if (fieldErrors.length > 0) {
      fieldErrors.forEach(([, error]) => {
        toast.error(error);
      });
      return;
    }

    axios
      .put(`http://localhost:3000/api/driver/update/${id}`, driverData)
      .then(() => {
        toast.success("Driver updated successfully!");
        setTimeout(() => {
          navigate("/driver-management");
        }, 2000);
      })
      .catch((error) => {
        toast.error("Driver update failed!");
        console.error("Error updating driver:", error);
      });
  };

  return (
    <main>
      <div className="flex min-h-screen bg-zinc-950">
        <SideBar />
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">
                Update Driver
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Edit driver profile and information
              </p>
            </div>
          </div>
          <div className="mx-6 my-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-4xl">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-10"
            >
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Driver ID
                </label>
                <input
                  type="text"
                  placeholder="Enter driver ID"
                  id="driverId"
                  name="driverId"
                  value={driverData.driverId}
                  onChange={handleChange}
                  className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                  readOnly
                />

                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter driver name"
                  id="driverName"
                  name="driverName"
                  value={driverData.driverName}
                  onChange={handleChange}
                  className="input-field text-sm mb-4"
                  maxLength="100"
                  minLength="10"
                  required
                />

                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Driver License
                </label>
                <input
                  type="text"
                  placeholder="Enter driver license number"
                  id="driverLicense"
                  name="driverLicense"
                  value={driverData.driverLicense}
                  onChange={handleChange}
                  className="input-field text-sm mb-4"
                  required
                />

                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                      Vehicle Model
                    </label>
                    <select
                      id="vehicleModel"
                      name="vehicleModel"
                      value={driverData.vehicleModel}
                      onChange={handleChange}
                      className="input-field text-sm mb-4"
                      required
                    >
                      <option value="Bike">Bike</option>
                      <option value="Threewheel">Threewheel</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                      Availability
                    </label>
                    <select
                      id="availabilty"
                      name="availabilty"
                      value={driverData.availabilty}
                      onChange={handleChange}
                      className="input-field text-sm mb-4"
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  License Validity
                </label>
                <div className="flex gap-6 flex-wrap mb-2">
                  <div className="flex gap-2 items-center">
                    <input
                      onChange={handleValidityChange}
                      checked={driverData.licenseValidity === "Valid"}
                      type="checkbox"
                      name="licenseValidity"
                      id="Valid"
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span className="text-zinc-300 text-sm">Valid</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      onChange={handleValidityChange}
                      checked={driverData.licenseValidity === "Expired"}
                      type="checkbox"
                      name="licenseValidity"
                      id="Expired"
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span className="text-zinc-300 text-sm">Expired</span>
                  </div>
                </div>
                <p className="text-amber-500/80 text-xs mb-2">
                  If either driver or vehicle license is expired, select
                  'Expired'
                </p>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter number without initial zero"
                  id="contactNo"
                  name="contactNo"
                  pattern="[0-9]{9}"
                  value={driverData.contactNo}
                  onChange={handleChange}
                  className="input-field text-sm mb-4"
                  maxLength="9"
                  minLength="9"
                  required
                />

                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Vehicle License
                </label>
                <input
                  type="text"
                  placeholder="Enter vehicle license number"
                  id="vehicleLicense"
                  name="vehicleLicense"
                  value={driverData.vehicleLicense}
                  onChange={handleChange}
                  className="input-field text-sm mb-4"
                  required
                />

                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter login password"
                  id="password"
                  name="password"
                  value={driverData.password}
                  onChange={handleChange}
                  className="input-field text-sm mb-4"
                  required
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mb-2">{errors.password}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary font-semibold w-full py-2.5 mt-3"
                >
                  Update Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
