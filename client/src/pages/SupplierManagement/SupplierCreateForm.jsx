import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";

export default function SupplierCreateForm() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    supplierID: "",
    firstName: "",
    lastName: "",
    DOB: "",
    email: "",
    contactNo: "",
    NIC: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSupplierIDUnique, setIsSupplierIDUnique] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form value
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset errors for the changed field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error for this field
    }));
  };

  const handleSupplierIDBlur = async () => {
    const { supplierID } = value;

    if (!supplierID.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        supplierID: "Supplier ID is required.",
      }));
      setIsSupplierIDUnique(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/supplier/check/${supplierID}`,
      );
      const isUnique = response.data.unique;

      if (!isUnique) {
        setIsSupplierIDUnique(false);
        toast.error(
          "Supplier ID already exists. Please choose a different one.",
        );
      } else {
        setIsSupplierIDUnique(true);
        setErrors((prevErrors) => ({
          ...prevErrors,
          supplierID: "",
        }));
      }
    } catch (error) {
      console.error("Error checking supplier ID:", error);
      toast.error("Error checking Supplier ID. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSupplierIDUnique) {
      toast.error("Supplier ID must be unique. Please choose a different one.");
      return; // Prevent submission if the supplierID isn't unique
    }

    const validationErrors = validateInputs(value);
    if (Object.keys(validationErrors).length > 0) {
      // Display a toast for each error
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/supplier/create",
        value,
      );
      if (response.data.success) {
        toast.success("Supplier created successfully!", { duration: 4000 });
        setTimeout(() => {
          navigate("/supplier-management");
        }, 1000);
      } else {
        toast.error("Failed to create supplier. Please try again.");
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      toast.error("Supplier ID already Exists.");
    }

    setLoading(false);
  };

  const validateInputs = (inputValues) => {
    const validationErrors = {};

    if (!inputValues.supplierID.trim()) {
      validationErrors.supplierID = "Supplier ID is required";
    }

    if (!inputValues.firstName.trim()) {
      validationErrors.firstName = "First name is required";
    }

    if (!inputValues.lastName.trim()) {
      validationErrors.lastName = "Last name is required";
    }

    if (!inputValues.DOB) {
      validationErrors.DOB = "Date Of Birth is required";
    }

    if (!inputValues.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(inputValues.email)) {
      validationErrors.email = "Invalid email format";
    }

    // Validate contact number: must be exactly 10 digits, no letters or special characters
    if (!/^\d{10}$/.test(inputValues.contactNo.trim())) {
      validationErrors.contactNo =
        "Contact Number must contain exactly 10 digits with no letters or special characters";
    }

    if (!inputValues.NIC.trim()) {
      validationErrors.NIC = "NIC is required";
    }

    if (!inputValues.address.trim()) {
      validationErrors.address = "Address is required";
    }

    return validationErrors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-zinc-100">
            Add New Supplier
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Fill in the details to register a new supplier
          </p>
        </div>
        <div className="mx-6 mb-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-8"
          >
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Supplier ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUP-001"
                  id="supplierID"
                  name="supplierID"
                  value={value.supplierID}
                  onChange={handleChange}
                  onBlur={handleSupplierIDBlur}
                  className={`input-field text-sm ${errors.supplierID ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.supplierID && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.supplierID}
                  </span>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter supplier company name"
                  id="firstName"
                  name="firstName"
                  value={value.firstName}
                  onChange={handleChange}
                  className={`input-field text-sm ${errors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.firstName && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter contact person name"
                  id="lastName"
                  name="lastName"
                  value={value.lastName}
                  onChange={handleChange}
                  className={`input-field text-sm ${errors.lastName ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.lastName && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.lastName}
                  </span>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Contact Number *
                </label>
                <input
                  type="text"
                  placeholder="10-digit number"
                  id="contactNo"
                  name="contactNo"
                  value={value.contactNo}
                  onChange={handleChange}
                  className={`input-field text-sm ${errors.contactNo ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.contactNo && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.contactNo}
                  </span>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Address *
                </label>
                <textarea
                  placeholder="Enter full address"
                  id="address"
                  name="address"
                  value={value.address}
                  onChange={handleChange}
                  className={`input-field text-sm min-h-[80px] ${errors.address ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.address && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.address}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary py-3 w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !isSupplierIDUnique}
              >
                {loading ? "Submitting..." : "Create Supplier"}
              </button>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Email *
                </label>
                <input
                  type="text"
                  placeholder="supplier@email.com"
                  id="email"
                  name="email"
                  value={value.email}
                  onChange={handleChange}
                  className={`input-field text-sm ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="DOB"
                  name="DOB"
                  value={value.DOB}
                  onChange={handleChange}
                  className={`input-field text-sm ${errors.DOB ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.DOB && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.DOB}
                  </span>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  NIC *
                </label>
                <input
                  type="text"
                  placeholder="Enter NIC number"
                  id="NIC"
                  name="NIC"
                  value={value.NIC}
                  onChange={handleChange}
                  className={`input-field text-sm ${errors.NIC ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.NIC && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.NIC}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
