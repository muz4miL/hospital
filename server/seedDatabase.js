// Seed Database with Common Pakistani Medicines for Peshawar Pharmacies
// Run this ONCE before your demo

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inventory from './models/inventory.model.js';

dotenv.config();

const pakistaniMedicines = [
  // PAIN & FEVER (High Volume)
  {
    Mname: "Panadol 500mg",
    Mprice: 15,
    Mquantity: 500,
    Msupplier: "GSK Pakistan",
    expirAt: new Date("2026-12-31"),
    manuAt: new Date("2025-06-01"),
    storageCondition: "Room Temperature (15-25°C)",
    type: "Analgesic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Panadol"
  },
  {
    Mname: "Brufen 400mg",
    Mprice: 25,
    Mquantity: 350,
    Msupplier: "Abbott Laboratories",
    expirAt: new Date("2027-03-15"),
    manuAt: new Date("2025-09-01"),
    storageCondition: "Room Temperature",
    type: "Anti-inflammatory",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Brufen"
  },
  {
    Mname: "Disprin Tablets",
    Mprice: 10,
    Mquantity: 600,
    Msupplier: "Reckitt Benckiser Pakistan",
    expirAt: new Date("2026-11-20"),
    manuAt: new Date("2025-05-15"),
    storageCondition: "Cool Dry Place",
    type: "Analgesic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Disprin"
  },
  {
    Mname: "Ponstan 500mg",
    Mprice: 45,
    Mquantity: 200,
    Msupplier: "Pfizer Pakistan",
    expirAt: new Date("2026-08-30"),
    manuAt: new Date("2025-02-15"),
    storageCondition: "Room Temperature",
    type: "Anti-inflammatory",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Ponstan"
  },

  // ANTIBIOTICS (Essential Stock)
  {
    Mname: "Augmentin 625mg",
    Mprice: 320,
    Mquantity: 180,
    Msupplier: "GSK Pakistan",
    expirAt: new Date("2026-10-15"),
    manuAt: new Date("2025-04-01"),
    storageCondition: "Below 25°C",
    type: "Antibiotic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Augmentin"
  },
  {
    Mname: "Flagyl 400mg",
    Mprice: 85,
    Mquantity: 250,
    Msupplier: "Sanofi Pakistan",
    expirAt: new Date("2027-01-20"),
    manuAt: new Date("2025-07-10"),
    storageCondition: "Room Temperature",
    type: "Antibiotic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Flagyl"
  },
  {
    Mname: "Cefspan 200mg",
    Mprice: 180,
    Mquantity: 150,
    Msupplier: "Getz Pharma",
    expirAt: new Date("2026-09-25"),
    manuAt: new Date("2025-03-15"),
    storageCondition: "Cool Place",
    type: "Antibiotic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Cefspan"
  },
  {
    Mname: "Zithromax 250mg",
    Mprice: 420,
    Mquantity: 120,
    Msupplier: "Pfizer Pakistan",
    expirAt: new Date("2027-02-28"),
    manuAt: new Date("2025-08-20"),
    storageCondition: "Below 30°C",
    type: "Antibiotic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Zithromax"
  },

  // GASTRIC/DIGESTIVE (Very Common)
  {
    Mname: "Risek 20mg",
    Mprice: 195,
    Mquantity: 280,
    Msupplier: "Getz Pharma",
    expirAt: new Date("2026-12-10"),
    manuAt: new Date("2025-06-05"),
    storageCondition: "Room Temperature",
    type: "Antacid",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Risek"
  },
  {
    Mname: "Motilium 10mg",
    Mprice: 120,
    Mquantity: 220,
    Msupplier: "Abbott Laboratories",
    expirAt: new Date("2027-04-15"),
    manuAt: new Date("2025-10-01"),
    storageCondition: "Cool Dry Place",
    type: "Digestive",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Motilium"
  },
  {
    Mname: "Antacid Syrup 120ml",
    Mprice: 60,
    Mquantity: 300,
    Msupplier: "Local Manufacturer",
    expirAt: new Date("2026-07-30"),
    manuAt: new Date("2025-01-20"),
    storageCondition: "Room Temperature",
    type: "Antacid",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Antacid"
  },

  // COLD & FLU (High Demand in Winter)
  {
    Mname: "Arinac Forte",
    Mprice: 90,
    Mquantity: 400,
    Msupplier: "Horizon Pharma",
    expirAt: new Date("2026-11-30"),
    manuAt: new Date("2025-05-25"),
    storageCondition: "Room Temperature",
    type: "Cold & Flu",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Arinac"
  },
  {
    Mname: "Actifed Syrup 100ml",
    Mprice: 110,
    Msupplier: "GSK Pakistan",
    Mquantity: 180,
    expirAt: new Date("2026-10-20"),
    manuAt: new Date("2025-04-10"),
    storageCondition: "Cool Place",
    type: "Cold & Flu",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Actifed"
  },

  // PEDIATRIC (Essential)
  {
    Mname: "Calpol Syrup 120ml",
    Mprice: 85,
    Mquantity: 320,
    Msupplier: "GSK Pakistan",
    expirAt: new Date("2027-01-15"),
    manuAt: new Date("2025-07-01"),
    storageCondition: "Room Temperature",
    type: "Pediatric Analgesic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Calpol"
  },
  {
    Mname: "Riabal Drops 15ml",
    Mprice: 180,
    Mquantity: 150,
    Msupplier: "Sanofi Pakistan",
    expirAt: new Date("2026-09-30"),
    manuAt: new Date("2025-03-20"),
    storageCondition: "Cool Dry Place",
    type: "Pediatric Antispasmodic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Riabal"
  },

  // VITAMINS & SUPPLEMENTS
  {
    Mname: "Centrum Multivitamin",
    Mprice: 450,
    Mquantity: 100,
    Msupplier: "Pfizer Pakistan",
    expirAt: new Date("2027-06-30"),
    manuAt: new Date("2025-12-01"),
    storageCondition: "Cool Dry Place",
    type: "Vitamin",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Centrum"
  },
  {
    Mname: "Folic Acid 5mg",
    Mprice: 35,
    Mquantity: 250,
    Msupplier: "Local Manufacturer",
    expirAt: new Date("2027-03-20"),
    manuAt: new Date("2025-09-15"),
    storageCondition: "Room Temperature",
    type: "Vitamin",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Folic-Acid"
  },

  // DIABETES (Growing Market)
  {
    Mname: "Glucophage 500mg",
    Mprice: 180,
    Mquantity: 200,
    Msupplier: "Merck Pakistan",
    expirAt: new Date("2027-02-15"),
    manuAt: new Date("2025-08-10"),
    storageCondition: "Room Temperature",
    type: "Antidiabetic",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Glucophage"
  },

  // CARDIOVASCULAR
  {
    Mname: "Cardace 5mg",
    Mprice: 220,
    Mquantity: 150,
    Msupplier: "Sanofi Pakistan",
    expirAt: new Date("2026-12-25"),
    manuAt: new Date("2025-06-20"),
    storageCondition: "Cool Dry Place",
    type: "Cardiovascular",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Cardace"
  },

  // LOW STOCK ITEMS (To Demo Alerts)
  {
    Mname: "Imodium 2mg",
    Mprice: 150,
    Mquantity: 15, // LOW STOCK
    Msupplier: "Johnson & Johnson",
    expirAt: new Date("2026-08-15"),
    manuAt: new Date("2025-02-10"),
    storageCondition: "Room Temperature",
    type: "Antidiarrheal",
    status: "Low Stock",
    imageUrl: "https://via.placeholder.com/150?text=Imodium"
  },

  // EXPIRING SOON (To Demo Expiry Alert)
  {
    Mname: "Old Stock Medicine",
    Mprice: 100,
    Mquantity: 50,
    Msupplier: "Demo Supplier",
    expirAt: new Date("2025-04-10"), // EXPIRING IN ~40 DAYS
    manuAt: new Date("2024-04-10"),
    storageCondition: "Room Temperature",
    type: "Demo",
    status: "Available",
    imageUrl: "https://via.placeholder.com/150?text=Expiring-Soon"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB');

    // Clear existing inventory (CAREFUL - only for demo setup)
    await Inventory.deleteMany({});
    console.log('🗑️  Cleared existing inventory');

    // Drop any problematic unique index on generatedBarcode
    try {
      await Inventory.collection.dropIndex('generatedBarcode_1');
    } catch (e) { /* index may not exist, ignore */ }

    // Auto-generate unique barcodes for each medicine
    const medicinesWithBarcodes = pakistaniMedicines.map((med, index) => ({
      ...med,
      generatedBarcode: `KMP${String(index + 1).padStart(10, '0')}`,
      batchNumber: `B${new Date().getFullYear()}-${String(index + 1).padStart(4, '0')}`,
    }));

    // Insert Pakistani medicines
    await Inventory.insertMany(medicinesWithBarcodes);
    console.log(`✅ Added ${medicinesWithBarcodes.length} medicines to inventory`);

    console.log('\n📊 Database seeded successfully!');
    console.log('🎯 Ready for demo at Hayatabad pharmacies\n');

    // Show summary
    const totalValue = pakistaniMedicines.reduce((sum, med) => sum + (med.Mprice * med.Mquantity), 0);
    console.log(`💰 Total Inventory Value: Rs. ${totalValue.toLocaleString()}`);
    console.log(`📦 Total Items: ${pakistaniMedicines.length} medicines`);
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
