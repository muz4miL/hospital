import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";

export default function UserPaymentDetails() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    NIC: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? (checked ? "Active" : "Inactive") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addPayment = await axios.post(
        "/api/payment/create",
        value,
      );
      const response = addPayment.data;
      if (response.success) {
        toast.success(response.message, { duration: 4000 });
        setTimeout(() => {
          navigate("/");
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(value);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Add Payment
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Enter patient payment details
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
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                id="firstName"
                name="firstName"
                value={value.firstName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                id="lastName"
                name="lastName"
                value={value.lastName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                ID Number (NIC)
              </label>
              <input
                type="text"
                placeholder="Enter ID number"
                id="NIC"
                name="NIC"
                value={value.NIC}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Enter contact number"
                id="phoneNumber"
                name="phoneNumber"
                value={value.phoneNumber}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Address
              </label>
              <textarea
                placeholder="Enter address"
                id="address"
                name="address"
                value={value.address}
                onChange={handleChange}
                className="input-field text-sm mb-4 min-h-20"
                required
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Submit Payment
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                id="city"
                name="city"
                value={value.city}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="Enter postal code"
                id="postalCode"
                name="postalCode"
                value={value.postalCode}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                State / Province
              </label>
              <input
                type="text"
                placeholder="Enter state"
                id="state"
                name="state"
                value={value.state}
                onChange={handleChange}
                className="input-field text-sm mb-4"
                required
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
