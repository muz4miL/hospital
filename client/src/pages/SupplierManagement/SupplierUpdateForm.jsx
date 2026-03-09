import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function SupplierUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplierData, setSupplierData] = useState({
    supplierID: "",
    firstName: "",
    lastName: "",
    contactNo: "",
    address: "",
    email: "",
    DOB: "",
    NIC: "",
  });

  useEffect(() => {
    axios
      .get(`/api/supplier/get/${id}`)
      .then((result) => {
        const supplier = result.data.supplier;

        //supplier.createdAt = supplier.createdAt.split('T')[0];
        //supplier.expiredAt = supplier.expiredAt.split('T')[0];
        setSupplierData(supplier);

        console.log(supplier);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { id } = e.target;
    const newStatus = id === "Active" ? "Active" : "Inactive";
    setSupplierData((prevState) => ({
      ...prevState,
      status: newStatus,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`/api/supplier/update/${id}`, supplierData)
      .then(() => {
        toast.success("Supplier updated successfully!");
        setTimeout(() => {
          navigate("/supplier-management");
        });
      })
      .catch((error) => {
        toast.error("Supplier update failed!");
        console.error("Error updating supplier:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Update Supplier
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Edit supplier information
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
                Supplier ID
              </label>
              <input
                type="text"
                placeholder="Enter supplier ID"
                id="supplierID"
                name="supplierID"
                value={supplierData.supplierID}
                onChange={handleChange}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Supplier Name
              </label>
              <input
                type="text"
                placeholder="Enter supplier name"
                id="firstName"
                name="firstName"
                value={supplierData.firstName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="Enter contact person name"
                id="lastName"
                name="lastName"
                value={supplierData.lastName}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Enter contact number"
                id="contactNo"
                name="contactNo"
                value={supplierData.contactNo}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Address
              </label>
              <textarea
                placeholder="Enter address"
                id="address"
                name="address"
                value={supplierData.address}
                onChange={handleChange}
                className="input-field text-sm mb-4 max-h-40 min-h-40"
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Update Supplier
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter email"
                id="email"
                name="email"
                value={supplierData.email}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Date of Birth
              </label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={supplierData.DOB}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                NIC
              </label>
              <input
                type="text"
                placeholder="Enter NIC"
                id="NIC"
                name="NIC"
                value={supplierData.NIC}
                onChange={handleChange}
                className="input-field text-sm mb-4"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
