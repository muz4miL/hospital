import { useState, useEffect } from "react";
import DriverTable from "./DriverTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

export default function DriverManagement() {
  const [driverCount, setDriverCount] = useState(0);
  const [availableDriverCount, setAvailableDriverCount] = useState(0);
  const [unavailableDriverCount, setUnavailableDriverCount] = useState(0);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    fetch("http://localhost:3000/api/driver/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch drivers:", response.statusText);
          throw new Error("Failed to fetch drivers");
        }
      })
      .then((data) => {
        const drivers = data.driver;
        setDriverCount(drivers.length);

        const availableDriverCount = drivers.filter(
          (driver) =>
            driver.availabilty === "Available" &&
            driver.licenseValidity === "Valid",
        );
        const unavailableDriverCount = drivers.filter(
          (driver) =>
            driver.availabilty === "Unavailable" ||
            driver.licenseValidity === "Expired",
        );

        setAvailableDriverCount(availableDriverCount.length);
        setUnavailableDriverCount(unavailableDriverCount.length);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Driver Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage drivers and track availability
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/driver-create"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-4 text-sm"
            >
              + Add Driver
            </Link>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-3 gap-4 border-b border-zinc-800">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Total Drivers</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">
              {driverCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Available</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              {availableDriverCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Unavailable</p>
            <p className="text-3xl font-bold text-red-400 mt-1">
              {unavailableDriverCount}
            </p>
          </div>
        </div>
        <div className="px-6 py-3 border-b border-zinc-800">
          <span className="text-sm text-zinc-400">
            All Drivers ({driverCount})
          </span>
        </div>
        <DriverTable />
      </div>
    </div>
  );
}
