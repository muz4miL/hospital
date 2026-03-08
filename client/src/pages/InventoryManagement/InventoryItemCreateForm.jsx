import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import SideBar from "../../components/SideBar";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

export default function Inventorycreateform() {
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState();
  const [files, setFiles] = useState();
  const [error, setError] = useState("");
  const [uploading, setuploading] = useState(false);
  const [value, setValue] = useState({
    Mname: "",
    Mprice: "",
    Mquantity: "",
    Msupplier: "",
    type: "Capsule",
    manuAt: "",
    expirAt: "",
    storageCondition: "",
    imageUrls: "",
    status: "Active",
  });

  console.log(value.imageUrls);

  const handleImageSubmit = async (e) => {
    if (files.length > 0) {
      try {
        setuploading(true);
        const imageUrl = await storeImage(files[0]);
        setValue({
          ...value,
          imageUrl: imageUrl, // Corrected key: imageUrl instead of imageUrls  //Can use any name // like a variable // use as a key
        });
        setuploading(false);
        setImageUploadError(false);
      } catch (error) {
        setImageUploadError("Image upload failed (2mb max per image)");
        setuploading(false);
      }
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === "Mprice" || name === "Mquantity") {
      const numericValue = parseFloat(value);
      if (numericValue < 0 || isNaN(numericValue)) {
        setError("Please enter a valid non-negative value.");
        parsedValue = ""; // Clear the value
      } else {
        setError(""); // Clear any previous error
      }
    } else if (name === "status") {
      parsedValue = "Active";
    }

    setValue((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addInventory = await axios.post(
        "http://localhost:3000/api/inventory/create",
        value,
      );
      const response = addInventory.data;
      if (response.success) {
        toast.success(response.message, { duration: 2000 });
        setTimeout(() => {
          navigate("/inventory-management");
        }, 1000);
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
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Add New Medicine</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Fill in the details to add a new medicine to inventory
          </p>
        </div>
        <div className="p-6 mx-6 mb-6 border bg-zinc-900 rounded-xl border-zinc-800">
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
                  placeholder="e.g. Panadol 500mg"
                  name="Mname"
                  value={value.Mname}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Selling Price (Rs.) *
                  </label>
                  <input
                    type="Number"
                    placeholder="0"
                    name="Mprice"
                    value={value.Mprice}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Cost Price (Rs.)
                  </label>
                  <input
                    type="Number"
                    placeholder="0"
                    name="McostPrice"
                    value={value.McostPrice || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                  />
                </div>
              </div>
              {error && <span className="text-xs text-red-400">{error}</span>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Quantity *
                  </label>
                  <input
                    type="Number"
                    placeholder="0"
                    name="Mquantity"
                    value={value.Mquantity}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                    Reorder Level
                  </label>
                  <input
                    type="Number"
                    placeholder="20"
                    name="reorderLevel"
                    value={value.reorderLevel || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Supplier *
                </label>
                <input
                  type="text"
                  placeholder="e.g. GSK Pakistan"
                  name="Msupplier"
                  value={value.Msupplier}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Storage Condition *
                </label>
                <textarea
                  placeholder="e.g. Room Temperature (15-25°C)"
                  name="storageCondition"
                  value={value.storageCondition}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm min-h-[60px] max-h-[80px]"
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
                    value={value.manuAt}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 text-sm"
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
                    value={value.expirAt}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 text-sm"
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
                    value={value.type}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 text-sm"
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
                    value={value.unit || "Strip"}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 text-sm"
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
                    value={value.batchNumber || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
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
                    value={value.shelfLocation || ""}
                    onChange={handleChange}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Factory Barcode (if available)
                </label>
                <input
                  type="text"
                  placeholder="Scan or enter barcode number"
                  name="factoryBarcode"
                  value={value.factoryBarcode || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                />
                <p className="mt-1 text-xs text-zinc-600">
                  Leave empty to auto-generate a barcode
                </p>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Pack Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 tablets per strip"
                  name="packSize"
                  value={value.packSize || ""}
                  onChange={handleChange}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 w-full focus:outline-none focus:border-emerald-500 placeholder-zinc-600 text-sm"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                  Medicine Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full p-2 text-sm border rounded-lg bg-zinc-800 border-zinc-700 text-zinc-400 file:mr-3 file:bg-zinc-700 file:text-zinc-300 file:border-0 file:rounded file:px-3 file:py-1 file:text-xs"
                    type="file"
                    accept="image/*"
                  />
                  <button
                    onClick={handleImageSubmit}
                    type="button"
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-white transition rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
                {imageUploadError && (
                  <p className="mt-1 text-xs text-red-400">
                    {imageUploadError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${value.status === "Active" ? "bg-emerald-500" : "bg-zinc-500"}`}
                ></div>
                <span className="text-sm text-zinc-400">Status: Available</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 mt-2 text-sm font-medium text-white transition rounded-lg bg-emerald-600 hover:bg-emerald-500"
              >
                Add Medicine to Inventory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
