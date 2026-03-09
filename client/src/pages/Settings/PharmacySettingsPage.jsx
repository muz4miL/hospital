import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import {
  FiSave,
  FiSettings,
  FiPrinter,
  FiDollarSign,
  FiGlobe,
} from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

export default function PharmacySettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("branding");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) {
      toast.error("Failed to load settings");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        toast.success("Settings saved successfully!");
        // Apply theme immediately
        if (data.settings.theme === "light") {
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
        }
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "branding", label: "Pharmacy Info", icon: <BiStore /> },
    { id: "receipt", label: "Receipt Template", icon: <FiPrinter /> },
    { id: "tax", label: "Tax & Currency", icon: <FiDollarSign /> },
    { id: "appearance", label: "Appearance", icon: <FiGlobe /> },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-zinc-950">
        <SideBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      <Toaster position="top-right" />
      <SideBar />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
              <FiSettings className="text-emerald-400" /> Settings
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Configure your pharmacy system
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            <FiSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg w-fit border border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-zinc-800 text-emerald-400"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">
          {/* ── Branding Tab ─────────────────────────────────────────── */}
          {activeTab === "branding" && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Pharmacy Information
                </h2>
                <p className="text-zinc-500 text-sm mb-6">
                  This information appears on receipts, reports, and throughout
                  the system.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">
                      Pharmacy Name *
                    </label>
                    <input
                      type="text"
                      value={settings?.pharmacyName || ""}
                      onChange={(e) =>
                        updateField("pharmacyName", e.target.value)
                      }
                      className="input-field"
                      placeholder="e.g. Khyber Pharmacy"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settings?.tagline || ""}
                      onChange={(e) => updateField("tagline", e.target.value)}
                      className="input-field"
                      placeholder="e.g. Your Health, Our Priority"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={settings?.address || ""}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="input-field"
                      placeholder="e.g. University Road, Peshawar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      value={settings?.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="input-field"
                      placeholder="e.g. 0300-1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings?.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="input-field"
                      placeholder="e.g. info@khyberpharmacy.pk"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      value={settings?.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="input-field"
                      placeholder="e.g. www.khyberpharmacy.pk"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      NTN Number
                    </label>
                    <input
                      type="text"
                      value={settings?.ntnNumber || ""}
                      onChange={(e) => updateField("ntnNumber", e.target.value)}
                      className="input-field"
                      placeholder="e.g. 1234567-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Receipt Tab ──────────────────────────────────────────── */}
          {activeTab === "receipt" && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Receipt Customization
                </h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Customize how your receipts look when printed.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Receipt Header (extra line below pharmacy name)
                    </label>
                    <input
                      type="text"
                      value={settings?.receiptHeader || ""}
                      onChange={(e) =>
                        updateField("receiptHeader", e.target.value)
                      }
                      className="input-field"
                      placeholder="e.g. Licensed Pharmacy — Drug Sale Lic #12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Receipt Footer Message
                    </label>
                    <textarea
                      value={settings?.receiptFooter || ""}
                      onChange={(e) =>
                        updateField("receiptFooter", e.target.value)
                      }
                      className="input-field min-h-[80px]"
                      placeholder="e.g. Thank you! Get well soon."
                    />
                  </div>
                </div>
              </div>

              {/* Receipt Preview */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Preview
                </h2>
                <div className="mx-auto max-w-[300px] bg-white text-black rounded-lg p-5 font-mono text-xs">
                  <div className="text-center">
                    <p className="font-bold text-base">
                      {settings?.pharmacyName || "Pharmacy Name"}
                    </p>
                    {settings?.receiptHeader && (
                      <p className="text-gray-600 text-[10px]">
                        {settings.receiptHeader}
                      </p>
                    )}
                    <p>{settings?.address || "Address"}</p>
                    <p>Phone: {settings?.phone || "0300-XXXXXXX"}</p>
                    {settings?.ntnNumber && (
                      <p className="text-gray-600">
                        NTN: {settings.ntnNumber}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-dashed border-gray-400 my-2" />
                  <div className="flex justify-between">
                    <span>Invoice:</span>
                    <span>INV-20260309-0001</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>9/3/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>Walk-in</span>
                  </div>
                  <div className="border-t border-dashed border-gray-400 my-2" />
                  <div className="mb-1">
                    <div>Panadol 500mg</div>
                    <div className="flex justify-between text-gray-600">
                      <span>2 x Rs.15</span>
                      <span>Rs.30</span>
                    </div>
                  </div>
                  <div className="mb-1">
                    <div>Augmentin 625mg</div>
                    <div className="flex justify-between text-gray-600">
                      <span>1 x Rs.320</span>
                      <span>Rs.320</span>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-gray-400 my-2" />
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs.350</span>
                  </div>
                  {settings?.taxEnabled && (
                    <div className="flex justify-between">
                      <span>
                        {settings.taxLabel} ({settings.taxRate}%):
                      </span>
                      <span>
                        Rs.{Math.round(350 * (settings.taxRate / 100))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>TOTAL:</span>
                    <span>
                      Rs.
                      {settings?.taxEnabled
                        ? 350 + Math.round(350 * (settings.taxRate / 100))
                        : 350}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-400 my-2" />
                  <div className="text-center mt-2">
                    <p className="font-bold">
                      {settings?.receiptFooter || "Thank you!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tax & Currency Tab ────────────────────────────────────── */}
          {activeTab === "tax" && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Tax Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
                    <div>
                      <p className="text-zinc-100 font-medium">Enable Tax</p>
                      <p className="text-zinc-500 text-sm">
                        Add tax to all POS transactions
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updateField("taxEnabled", !settings?.taxEnabled)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.taxEnabled ? "bg-emerald-600" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings?.taxEnabled
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  {settings?.taxEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                          Tax Label
                        </label>
                        <input
                          type="text"
                          value={settings?.taxLabel || ""}
                          onChange={(e) =>
                            updateField("taxLabel", e.target.value)
                          }
                          className="input-field"
                          placeholder="GST"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={settings?.taxRate || 0}
                          onChange={(e) =>
                            updateField(
                              "taxRate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="input-field"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Currency
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Currency Symbol
                    </label>
                    <select
                      value={settings?.currency || "Rs."}
                      onChange={(e) => updateField("currency", e.target.value)}
                      className="input-field"
                    >
                      <option value="Rs.">Rs. (Pakistani Rupee)</option>
                      <option value="PKR">PKR</option>
                      <option value="$">$ (Dollar)</option>
                      <option value="£">£ (Pound)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance Tab ────────────────────────────────────────── */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Theme
                </h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Choose your preferred interface theme.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Dark Mode Card */}
                  <button
                    onClick={() => updateField("theme", "dark")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      settings?.theme === "dark"
                        ? "border-emerald-500 bg-zinc-800"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-700 flex items-center justify-center">
                        <span className="text-lg">🌙</span>
                      </div>
                      <div>
                        <p className="text-zinc-100 font-semibold">Dark</p>
                        <p className="text-zinc-500 text-xs">
                          Easy on the eyes
                        </p>
                      </div>
                    </div>
                    {/* Mini preview */}
                    <div className="h-16 rounded-lg bg-zinc-950 border border-zinc-700 p-2">
                      <div className="flex gap-1">
                        <div className="w-8 h-full bg-zinc-900 rounded" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-zinc-800 rounded w-3/4" />
                          <div className="h-2 bg-zinc-800 rounded w-1/2" />
                          <div className="h-2 bg-emerald-500/30 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                    {settings?.theme === "dark" && (
                      <div className="mt-2 text-center text-emerald-400 text-xs font-medium">
                        ✓ Active
                      </div>
                    )}
                  </button>

                  {/* Light Mode Card */}
                  <button
                    onClick={() => updateField("theme", "light")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      settings?.theme === "light"
                        ? "border-emerald-500 bg-zinc-800"
                        : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <span className="text-lg">☀️</span>
                      </div>
                      <div>
                        <p className="text-zinc-100 font-semibold">Light</p>
                        <p className="text-zinc-500 text-xs">
                          Classic bright mode
                        </p>
                      </div>
                    </div>
                    {/* Mini preview */}
                    <div className="h-16 rounded-lg bg-gray-100 border border-gray-300 p-2">
                      <div className="flex gap-1">
                        <div className="w-8 h-full bg-white rounded border border-gray-200" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-gray-200 rounded w-3/4" />
                          <div className="h-2 bg-gray-200 rounded w-1/2" />
                          <div className="h-2 bg-emerald-400/40 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                    {settings?.theme === "light" && (
                      <div className="mt-2 text-center text-emerald-400 text-xs font-medium">
                        ✓ Active
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
