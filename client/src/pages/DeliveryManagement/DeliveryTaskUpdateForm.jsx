import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function DeliveryTaskUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskData, settaskData] = useState({
    orderId: "",
    cusName: "",
    cusAddress: "",
    deliDate: "",
    assignDriv: "",
    deliStatus: "",
  });

  const [errors, setErrors] = useState({});
  const [filteredDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/task/get/${id}`)
      .then((result) => {
        const task = result.data.task;
        task.deliDate = task.deliDate.split("T")[0];
        settaskData(task);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const fetchAvailableDrivers = async () => {
      try {
        const response = await axios.get(
          "/api/driver/read",
        );
        console.log(response.data);
        const filteredDrivers = response.data.driver.filter(
          (driver) =>
            driver.availabilty === "Available" &&
            driver.licenseValidity === "Valid",
        );
        setAvailableDrivers(filteredDrivers);
      } catch (error) {
        console.error("Error fetching available drivers:", error);
      }
    };

    fetchAvailableDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    settaskData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateInputs = async (taskData) => {
    const validationErrors = {};

    if (!taskData.deliDate.trim()) {
      validationErrors.deliDate = "Delivery Date is required";
    } else {
      const deliveryDate = new Date(taskData.deliDate);
      const currentDate = new Date();

      if (deliveryDate < currentDate) {
        validationErrors.deliDate =
          "Delivery Date must be on or after current date";
      }
    }
    if (!taskData.cusName.trim()) {
      validationErrors.cusName = "Customer Name is required";
    }
    if (!taskData.cusAddress.trim()) {
      validationErrors.cusAddress = "Delivery Address is required";
    }
    if (!taskData.assignDriv.trim()) {
      validationErrors.assignDriv = "A Driver should be assigned";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = await validateInputs(taskData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) =>
        toast.error(error, { duration: 6000, position: "top-right" }),
      );
      return;
    }

    try {
      await axios.put(`/api/task/update/${id}`, taskData);
      toast.success("Task updated successfully!");
      setTimeout(() => {
        navigate("/taskpage");
      }, 1000);
    } catch (error) {
      toast.error("Task update failed!");
      console.error("Error updating task:", error);
    }
  };
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Update Delivery Task
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Edit task details and reassign driver
            </p>
          </div>
        </div>
        <div className="mx-6 my-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-4xl">
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-10"
          >
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Order ID
              </label>
              {errors.orderId && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.orderId}
                </span>
              )}
              <input
                type="text"
                placeholder="Enter order ID"
                id="orderId"
                name="orderId"
                value={taskData.orderId}
                onChange={handleChange}
                className={`input-field text-sm mb-4 opacity-60 cursor-not-allowed ${errors.orderId ? "border-red-500" : ""}`}
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Customer Name
              </label>
              {errors.cusName && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.cusName}
                </span>
              )}
              <input
                type="text"
                placeholder="Enter customer name"
                id="cusName"
                name="cusName"
                value={taskData.cusName}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.cusName ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Customer Address
              </label>
              {errors.cusAddress && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.cusAddress}
                </span>
              )}
              <input
                type="text"
                placeholder="Enter customer address"
                id="cusAddress"
                name="cusAddress"
                value={taskData.cusAddress}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.cusAddress ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Update Task
              </button>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Delivery Date
              </label>
              {errors.deliDate && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.deliDate}
                </span>
              )}
              <input
                type="date"
                id="deliDate"
                name="deliDate"
                value={taskData.deliDate}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.deliDate ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Assign Driver
              </label>
              <select
                id="assignDriv"
                name="assignDriv"
                value={taskData.assignDriv}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.assignDriv ? "border-red-500 focus:ring-red-500" : ""}`}
              >
                <option value="">Select a driver</option>
                {Array.isArray(filteredDrivers) &&
                  filteredDrivers.map((driver) => (
                    <option key={driver.driverId} value={driver.driverId}>
                      {driver.driverName}
                    </option>
                  ))}
              </select>

              <div className="flex flex-col gap-1">
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Delivery Status
                </label>
                <select
                  id="deliStatus"
                  name="deliStatus"
                  value={taskData.deliStatus}
                  onChange={handleChange}
                  className={`input-field text-sm mb-4 ${errors.deliStatus ? "border-red-500 focus:ring-red-500" : ""}`}
                >
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="On the way">On the way</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
