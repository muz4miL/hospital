import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";

export default function SupplyRequestForm() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    medicineName: "",
    quantity: "",
    supplier: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addSupplyRequest = await axios.post(
        "http://localhost:3000/api/supplyRequest/create",
        value,
      );
      const response = addSupplyRequest.data;
      if (response.success) {
        toast.success(response.message, { duration: 4000 });
        // Clear form fields after successful submission
        setValue({
          medicineName: "",
          quantity: "",
          supplier: "",
        });
        navigate("/inventory-management");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              New Supply Request
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Create a supply request for inventory
            </p>
          </div>
        </div>
        <div className="mx-6 my-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
              Medicine Name
            </label>
            <input
              type="text"
              placeholder="Enter medicine name"
              id="medicineName"
              name="medicineName"
              value={value.medicineName}
              onChange={handleChange}
              className="input-field text-sm mb-4"
            />

            <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              id="quantity"
              name="quantity"
              value={value.quantity}
              onChange={handleChange}
              className="input-field text-sm mb-4"
            />

            <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
              Supplier
            </label>
            <input
              type="text"
              placeholder="Enter supplier name"
              id="supplier"
              name="supplier"
              value={value.supplier}
              onChange={handleChange}
              className="input-field text-sm mb-4"
            />

            <button
              type="submit"
              className="btn-primary font-semibold w-full py-2.5 mt-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
