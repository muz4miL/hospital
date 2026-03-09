import mongoose from "mongoose";

const pharmacySettingsSchema = new mongoose.Schema(
  {
    // Only one document exists — the active config
    isActive: { type: Boolean, default: true, unique: true },

    // Branding
    pharmacyName: { type: String, default: "Khyber Pharmacy" },
    tagline: { type: String, default: "Your Health, Our Priority" },
    address: { type: String, default: "Hayatabad Phase 5, Peshawar" },
    phone: { type: String, default: "0300-1234567" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    ntnNumber: { type: String, default: "" },

    // Receipt
    receiptHeader: { type: String, default: "" },
    receiptFooter: { type: String, default: "Thank you! Get well soon." },
    showLogoOnReceipt: { type: Boolean, default: false },

    // Tax
    taxEnabled: { type: Boolean, default: false },
    taxRate: { type: Number, default: 0 },
    taxLabel: { type: String, default: "GST" },

    // Locale
    currency: { type: String, default: "Rs." },
    locale: { type: String, default: "en-PK" },

    // Theme
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
  },
  { timestamps: true }
);

const PharmacySettings = mongoose.model("PharmacySettings", pharmacySettingsSchema);

export default PharmacySettings;
