import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function DeliveryManagement() {
  const [taskCount, setTaskCount] = useState(0);
  const [deliveredTaskCount, setDeliveredTaskCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [availableDriverCount, setAvailableDriverCount] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("/api/task/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch tasks:", response.statusText);
          throw new Error("Failed to fetch tasks");
        }
      })
      .then((data) => {
        const tasks = data.task;
        setTaskCount(tasks.length);

        const deliveredTaskCount = tasks.filter(
          (task) => task.deliStatus === "Delivered",
        );
        setDeliveredTaskCount(deliveredTaskCount.length);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    fetch("/api/driver/read")
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
        setAvailableDriverCount(availableDriverCount.length);
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
              Delivery Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Overview of delivery tasks and driver operations
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/create-task"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-4 text-sm"
            >
              + Create Task
            </Link>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-4 gap-4 border-b border-zinc-800">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">{taskCount}</p>
          </div>
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Completed</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              {deliveredTaskCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Total Drivers</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">
              {driverCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Available Drivers</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              {availableDriverCount}
            </p>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <Link
            to="/taskpage"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20 hover:border-zinc-600 transition-colors"
          >
            <p className="text-zinc-100 font-medium">Manage Tasks</p>
            <p className="text-zinc-500 text-sm mt-1">
              View and update delivery tasks →
            </p>
          </Link>
          <Link
            to="/driver-management"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20 hover:border-zinc-600 transition-colors"
          >
            <p className="text-zinc-100 font-medium">Manage Drivers</p>
            <p className="text-zinc-500 text-sm mt-1">
              View driver profiles and availability →
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
