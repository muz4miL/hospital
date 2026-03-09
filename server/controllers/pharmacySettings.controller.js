import PharmacySettings from "../models/pharmacySettings.model.js";

// GET — fetch the singleton settings doc (creates default if none exists)
export const getSettings = async (req, res) => {
  try {
    let settings = await PharmacySettings.findOne({ isActive: true });
    if (!settings) {
      settings = await PharmacySettings.create({ isActive: true });
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("getSettings error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// PUT — update settings
export const updateSettings = async (req, res) => {
  try {
    const allowed = [
      "pharmacyName", "tagline", "address", "phone", "email", "website",
      "logoUrl", "ntnNumber", "receiptHeader", "receiptFooter",
      "showLogoOnReceipt", "taxEnabled", "taxRate", "taxLabel",
      "currency", "locale", "theme",
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    let settings = await PharmacySettings.findOneAndUpdate(
      { isActive: true },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("updateSettings error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
