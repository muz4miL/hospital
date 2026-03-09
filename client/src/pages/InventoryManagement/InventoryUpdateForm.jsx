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
    McostPrice: "",
    Mquantity: "",
    Msupplier: "",
    type: "",
    manuAt: "",
    expirAt: "",
    storageCondition: "",
    status: "Active",
    factoryBarcode: "",
    generatedBarcode: "",
    batchNumber: "",
    reorderLevel: "",
    unit: "Strip",
    packSize: "",
    shelfLocation: "",
  });

  useEffect(() => {
    getusingID();
  }, [id]);

  const getusingID = async () => {
    try {
      const result = await axios.get(`/api/inventory/getsingleitem/${id}`);
      const inv = result.data.inventory;
      inv.manuAt = inv.manuAt?.split("T")[0] || "";
      inv.expirAt = inv.expirAt?.split("T")[0] || "";
      setinventorydata(inv);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setinventorydata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/inventory/update/${id}`, inventorydata)
      .then(() => {
        toast.success("Inventory updated successfully!");
        setTimeout(() => navigate("/inventory-management"));
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
        <div className="mx-6 mb-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-5xl">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4"
          >
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter Medicine Name"
                  name="Mname"
                  value={inventorydata.Mname}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    name="Mprice"
                    value={inventorydata.Mprice}
                    onChange={handleChange}
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Cost Price (Rs.)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    name="McostPrice"
                    value={inventorydata.McostPrice || ""}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    name="Mquantity"
                    value={inventorydata.Mquantity}
                    onChange={handleChange}
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    name="reorderLevel"
                    value={inventorydata.reorderLevel || ""}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Supplier *
                </label>
                <input
                  type="text"
                  placeholder="Enter Supplier name"
                  name="Msupplier"
                  value={inventorydata.Msupplier}
                  onChange={handleChange}
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Storage Condition *
                </label>
                <textarea
                  placeholder="Enter Optimal storage conditions"
                  name="storageCondition"
                  value={inventorydata.storageCondition}
                  onChange={handleChange}
                  className="input-field text-sm max-h-20 min-h-[60px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Manufacture Date *
                  </label>
                  <input
                    type="date"
                    name="manuAt"
                    value={inventorydata.manuAt}
                    onChange={handleChange}
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expirAt"
                    value={inventorydata.expirAt}
                    onChange={handleChange}
                    className="input-field text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={inventorydata.type}
                    onChange={handleChange}
                    className="input-field text-sm"
                    required
                  >
                    <option value="Capsule">Capsule</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Anti-inflammatory">Anti-inflammatory</option>
                    <option value="Antacid">Antacid</option>
                    <option value="Antifungal">Antifungal</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Vitamin">Vitamin</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={inventorydata.unit || "Strip"}
                    onChange={handleChange}
                    className="input-field text-sm"
                  >
                    <option value="Strip">Strip</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Tube">Tube</option>
                    <option value="Box">Box</option>
                    <option value="Packet">Packet</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Injection">Injection</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Cream">Cream</option>
                    <option value="Drops">Drops</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Sachet">Sachet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B2026-001"
                    name="batchNumber"
                    value={inventorydata.batchNumber || ""}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Shelf Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A3-R2"
                    name="shelfLocation"
                    value={inventorydata.shelfLocation || ""}
                    onChange={handleChange}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Factory Barcode
                </label>
                <input
                  type="text"
                  placeholder="Scan or enter barcode number"
                  name="factoryBarcode"
                  value={inventorydata.factoryBarcode || ""}
                  onChange={handleChange}
                  className="input-field text-sm"
                />
                {inventorydata.generatedBarcode && (
                  <p className="mt-1 text-xs text-zinc-500">
                    System Barcode:{" "}
                    <span className="text-emerald-400 font-mono">
                      {inventorydata.generatedBarcode}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Pack Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 tablets per strip"
                  name="packSize"
                  value={inventorydata.packSize || ""}
                  onChange={handleChange}
                  className="input-field text-sm"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${inventorydata.status === "Active" ? "bg-emerald-500" : "bg-zinc-500"}`}
                />
                <span className="text-sm text-zinc-400">
                  Status:{" "}
                  {inventorydata.status === "Active" ? "Available" : "Inactive"}
                </span>
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
