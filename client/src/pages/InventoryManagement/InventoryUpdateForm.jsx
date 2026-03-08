import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function InventoryUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventorydata, setinventorydata] = useState({
    Mname: "",
    Mprice: "",
    Mquantity: "",
    Msupplier: "",
    type: "",
    manuAt: "",
    expirAt: "",
    storageCondition: "",
    status: "Active",
  });

  useEffect(() => {
    getusingID();
  }, [id]);

  const getusingID = async () => {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/inventory/getsingleitem/${id}`,
      );
      const inventory = result.data.inventory;

      inventory.manuAt = inventory.manuAt.split("T")[0];
      inventory.expirAt = inventory.expirAt.split("T")[0];
      setinventorydata(inventory);
      console.log(inventory);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Name:", name);
    console.log("Value:", value);
    setinventorydata((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3000/api/inventory/update/${id}`, inventorydata)
      .then(() => {
        toast.success("Inventory updated successfully!");
        setTimeout(() => {
          navigate("/inventory-management");
        });
      })
      .catch((error) => {
        toast.error("Inventory update failed!");
        console.error("Error updating Inventory:", error);
      });
  };

  return (
    <div className="flex bg-zinc-950 min-h-screen">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-zinc-100">
            Update Medicine
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Edit the inventory item details below
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
                  Medicine Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Medicine Name"
                  id="Mname"
                  name="Mname"
                  value={inventorydata.Mname}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Unit Price
                </label>
                <input
                  type="Number"
                  placeholder="Enter Unit price"
                  id="Mprice"
                  name="Mprice"
                  value={inventorydata.Mprice}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Quantity
                </label>
                <input
                  type="Number"
                  placeholder="Enter Quantity"
                  id="Mquantity"
                  name="Mquantity"
                  value={inventorydata.Mquantity}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Supplier
                </label>
                <input
                  type="text"
                  placeholder="Enter Supplier name"
                  id="Msupplier"
                  name="Msupplier"
                  value={inventorydata.Msupplier}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Storage Condition
                </label>
                <textarea
                  placeholder="Enter Optimal storage conditions"
                  id="Mdescription"
                  name="storageCondition"
                  value={inventorydata.storageCondition}
                  onChange={handleChange}
                  className="input-field text-sm max-h-20 min-h-[60px]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={inventorydata.type}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                >
                  <option value="Capsule">Capsule</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Liquid">Liquid</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Manufacture Date
                </label>
                <input
                  type="date"
                  id="manuAt"
                  name="manuAt"
                  value={inventorydata.manuAt}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expirAt"
                  name="expirAt"
                  value={inventorydata.expirAt}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  name="status"
                  id="active"
                  checked={inventorydata.status === "Active"}
                  disabled
                  className="w-4 h-4 accent-emerald-500"
                />
                <label className="text-zinc-400 text-sm">
                  Currently Active
                </label>
              </div>
              <button
                type="submit"
                className="btn-primary font-semibold py-3 mt-2"
              >
                Update Medicine
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
