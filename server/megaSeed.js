// ============================================================================
// MEGA SEED — Peshawar Pharmacy Demo Data
// Populates: Inventory, Sales, Suppliers, Employees, Salary, Leave, SupplyRequests
// Run: node --env-file=.env megaSeed.js
// ============================================================================

import mongoose from "mongoose";
import dotenv from "dotenv";
import Inventory from "./models/inventory.model.js";
import Sale from "./models/sale.model.js";
import Supplier from "./models/supplier.model.js";
import Employee from "./models/employee.model.js";
import EmployeeSalary from "./models/employeeSalary.model.js";
import EmployeeLeave from "./models/employeeLeave.model.js";
import SupplyRequest from "./models/supplyRequest.model.js";
import Notification from "./models/notification.model.js";

dotenv.config();

// ── Helpers ──────────────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rupees = (n) => `Rs. ${n.toLocaleString()}`;

// ── 1. INVENTORY — 50+ real Pakistani medicines ─────────────────────────────
const medicines = [
  // PAIN & FEVER
  { Mname: "Panadol 500mg", Mprice: 15, Mquantity: 500, Msupplier: "GSK Pakistan", type: "Analgesic", unit: "Strip", storageCondition: "Room Temperature (15-25°C)", McostPrice: 9 },
  { Mname: "Brufen 400mg", Mprice: 25, Mquantity: 350, Msupplier: "Abbott Laboratories", type: "Anti-inflammatory", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 16 },
  { Mname: "Disprin Tablets", Mprice: 10, Mquantity: 600, Msupplier: "Reckitt Benckiser", type: "Analgesic", unit: "Strip", storageCondition: "Cool Dry Place", McostPrice: 6 },
  { Mname: "Ponstan 500mg", Mprice: 45, Mquantity: 200, Msupplier: "Pfizer Pakistan", type: "Anti-inflammatory", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 30 },
  { Mname: "Nurofen 200mg", Mprice: 55, Mquantity: 150, Msupplier: "Reckitt Benckiser", type: "Analgesic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 38 },
  { Mname: "Tramal 50mg", Mprice: 120, Mquantity: 80, Msupplier: "Grunenthal Pakistan", type: "Analgesic", unit: "Strip", storageCondition: "Below 25°C", McostPrice: 85 },

  // ANTIBIOTICS
  { Mname: "Augmentin 625mg", Mprice: 320, Mquantity: 180, Msupplier: "GSK Pakistan", type: "Antibiotic", unit: "Strip", storageCondition: "Below 25°C", McostPrice: 220 },
  { Mname: "Flagyl 400mg", Mprice: 85, Mquantity: 250, Msupplier: "Sanofi Pakistan", type: "Antibiotic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 55 },
  { Mname: "Cefspan 200mg", Mprice: 180, Mquantity: 150, Msupplier: "Getz Pharma", type: "Antibiotic", unit: "Strip", storageCondition: "Cool Place", McostPrice: 120 },
  { Mname: "Zithromax 250mg", Mprice: 420, Mquantity: 120, Msupplier: "Pfizer Pakistan", type: "Antibiotic", unit: "Strip", storageCondition: "Below 30°C", McostPrice: 290 },
  { Mname: "Ciproxin 500mg", Mprice: 250, Mquantity: 140, Msupplier: "Bayer Pakistan", type: "Antibiotic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 170 },
  { Mname: "Amoxil 500mg", Mprice: 90, Mquantity: 300, Msupplier: "GSK Pakistan", type: "Antibiotic", unit: "Capsule", storageCondition: "Room Temperature", McostPrice: 55 },
  { Mname: "Velosef 500mg", Mprice: 210, Mquantity: 160, Msupplier: "BMS Pakistan", type: "Antibiotic", unit: "Capsule", storageCondition: "Below 25°C", McostPrice: 140 },

  // GASTRIC / DIGESTIVE
  { Mname: "Risek 20mg", Mprice: 195, Mquantity: 280, Msupplier: "Getz Pharma", type: "Antacid", unit: "Capsule", storageCondition: "Room Temperature", McostPrice: 130 },
  { Mname: "Motilium 10mg", Mprice: 120, Mquantity: 220, Msupplier: "Abbott Laboratories", type: "Digestive", unit: "Strip", storageCondition: "Cool Dry Place", McostPrice: 78 },
  { Mname: "Zantac 150mg", Mprice: 80, Mquantity: 180, Msupplier: "GSK Pakistan", type: "Antacid", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 50 },
  { Mname: "Entamizole DS", Mprice: 65, Mquantity: 300, Msupplier: "Searle Pakistan", type: "Antiparasitic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 40 },
  { Mname: "Buscopan 10mg", Mprice: 95, Mquantity: 170, Msupplier: "Sanofi Pakistan", type: "Antispasmodic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 62 },

  // COLD & FLU
  { Mname: "Arinac Forte", Mprice: 90, Mquantity: 400, Msupplier: "Horizon Pharma", type: "Cold & Flu", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 58 },
  { Mname: "Actifed Syrup 100ml", Mprice: 110, Mquantity: 180, Msupplier: "GSK Pakistan", type: "Cold & Flu", unit: "Bottle", storageCondition: "Cool Place", McostPrice: 72 },
  { Mname: "Corex-D Syrup", Mprice: 130, Mquantity: 160, Msupplier: "Pfizer Pakistan", type: "Cough Suppressant", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 85 },
  { Mname: "Sinarest Tablets", Mprice: 40, Mquantity: 300, Msupplier: "Centaur Pharma", type: "Cold & Flu", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 24 },

  // PEDIATRIC
  { Mname: "Calpol Syrup 120ml", Mprice: 85, Mquantity: 320, Msupplier: "GSK Pakistan", type: "Pediatric Analgesic", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 55 },
  { Mname: "Riabal Drops 15ml", Mprice: 180, Mquantity: 150, Msupplier: "Sanofi Pakistan", type: "Pediatric Antispasmodic", unit: "Drops", storageCondition: "Cool Dry Place", McostPrice: 120 },
  { Mname: "Rigix Syrup 60ml", Mprice: 95, Mquantity: 200, Msupplier: "Sami Pharma", type: "Antiallergic", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 60 },
  { Mname: "Flagyl Susp 120ml", Mprice: 70, Mquantity: 130, Msupplier: "Sanofi Pakistan", type: "Antibiotic", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 44 },

  // VITAMINS & SUPPLEMENTS
  { Mname: "Centrum Multivitamin", Mprice: 450, Mquantity: 100, Msupplier: "Pfizer Pakistan", type: "Vitamin", unit: "Box", storageCondition: "Cool Dry Place", McostPrice: 310 },
  { Mname: "Folic Acid 5mg", Mprice: 35, Mquantity: 250, Msupplier: "Hilton Pharma", type: "Vitamin", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 18 },
  { Mname: "Neurobion Forte", Mprice: 200, Mquantity: 140, Msupplier: "Merck Pakistan", type: "Vitamin B Complex", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 135 },
  { Mname: "Caltrate 600mg", Mprice: 280, Mquantity: 120, Msupplier: "Pfizer Pakistan", type: "Calcium Supplement", unit: "Box", storageCondition: "Cool Dry Place", McostPrice: 195 },
  { Mname: "Surbex-Z", Mprice: 160, Mquantity: 180, Msupplier: "Abbott Laboratories", type: "Vitamin", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 105 },

  // DIABETES
  { Mname: "Glucophage 500mg", Mprice: 180, Mquantity: 200, Msupplier: "Merck Pakistan", type: "Antidiabetic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 120 },
  { Mname: "Diamicron MR 60mg", Mprice: 350, Mquantity: 100, Msupplier: "Servier Pakistan", type: "Antidiabetic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 240 },
  { Mname: "Galvus 50mg", Mprice: 420, Mquantity: 80, Msupplier: "Novartis Pakistan", type: "Antidiabetic", unit: "Strip", storageCondition: "Below 30°C", McostPrice: 290 },

  // CARDIOVASCULAR / BP
  { Mname: "Cardace 5mg", Mprice: 220, Mquantity: 150, Msupplier: "Sanofi Pakistan", type: "Cardiovascular", unit: "Strip", storageCondition: "Cool Dry Place", McostPrice: 150 },
  { Mname: "Concor 5mg", Mprice: 260, Mquantity: 130, Msupplier: "Merck Pakistan", type: "Beta Blocker", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 180 },
  { Mname: "Amlodipine 5mg", Mprice: 75, Mquantity: 240, Msupplier: "Searle Pakistan", type: "Calcium Channel Blocker", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 45 },
  { Mname: "Aspirin 75mg", Mprice: 30, Mquantity: 400, Msupplier: "ICI Pakistan", type: "Blood Thinner", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 16 },
  { Mname: "Atorvastatin 20mg", Mprice: 150, Mquantity: 180, Msupplier: "Getz Pharma", type: "Statin", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 95 },

  // SKIN & TOPICAL
  { Mname: "Polyfax Skin Ointment", Mprice: 140, Mquantity: 200, Msupplier: "GSK Pakistan", type: "Topical Antibiotic", unit: "Tube", storageCondition: "Below 25°C", McostPrice: 92 },
  { Mname: "Dermovate Cream", Mprice: 280, Mquantity: 90, Msupplier: "GSK Pakistan", type: "Corticosteroid", unit: "Tube", storageCondition: "Below 25°C", McostPrice: 195 },
  { Mname: "Dettol Antiseptic 50ml", Mprice: 65, Mquantity: 250, Msupplier: "Reckitt Benckiser", type: "Antiseptic", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 40 },
  { Mname: "Candistan Cream", Mprice: 120, Mquantity: 110, Msupplier: "Getz Pharma", type: "Antifungal", unit: "Tube", storageCondition: "Room Temperature", McostPrice: 78 },

  // ALLERGY & RESPIRATORY
  { Mname: "Rigix 10mg", Mprice: 60, Mquantity: 300, Msupplier: "Sami Pharma", type: "Antihistamine", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 38 },
  { Mname: "Ventolin Inhaler", Mprice: 350, Mquantity: 70, Msupplier: "GSK Pakistan", type: "Bronchodilator", unit: "Inhaler", storageCondition: "Below 30°C", McostPrice: 235 },
  { Mname: "Montika 10mg", Mprice: 180, Mquantity: 120, Msupplier: "Getz Pharma", type: "Leukotriene Antagonist", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 118 },

  // EYE / ENT 
  { Mname: "Tobrex Eye Drops", Mprice: 220, Mquantity: 90, Msupplier: "Novartis Pakistan", type: "Ophthalmic Antibiotic", unit: "Drops", storageCondition: "Below 25°C", McostPrice: 150 },
  { Mname: "Otrivin Nasal Spray", Mprice: 95, Mquantity: 170, Msupplier: "Novartis Pakistan", type: "Nasal Decongestant", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 60 },

  // LOW STOCK — demo alerts
  { Mname: "Imodium 2mg", Mprice: 150, Mquantity: 8, Msupplier: "Johnson & Johnson", type: "Antidiarrheal", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 96, status: "Low Stock" },
  { Mname: "Nexium 40mg", Mprice: 380, Mquantity: 5, Msupplier: "AstraZeneca", type: "Proton Pump Inhibitor", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 260, status: "Low Stock" },
  { Mname: "Insulin Mixtard 30", Mprice: 950, Mquantity: 3, Msupplier: "Novo Nordisk", type: "Insulin", unit: "Injection", storageCondition: "Refrigerated (2-8°C)", McostPrice: 680, status: "Low Stock" },

  // EXPIRING SOON — demo expiry alerts
  { Mname: "Expired Cough Syrup [DEMO]", Mprice: 100, Mquantity: 40, Msupplier: "Demo Supplier", type: "Cough Suppressant", unit: "Bottle", storageCondition: "Room Temperature", McostPrice: 60, expirAt: new Date("2026-02-15") },
  { Mname: "Near-Expiry Paracetamol [DEMO]", Mprice: 12, Mquantity: 200, Msupplier: "Demo Supplier", type: "Analgesic", unit: "Strip", storageCondition: "Room Temperature", McostPrice: 7, expirAt: new Date("2026-04-05") },
];

// ── 2. SUPPLIERS — 8 realistic Peshawar-area distributors ───────────────────
const suppliers = [
  { supplierID: "SID001", firstName: "Muhammad", lastName: "Bilal", DOB: new Date("1978-03-15"), email: "bilal@gskpeshawar.pk", contactNo: 3219876543, NIC: "17301-4567891-3", address: "GT Road, Hashtnagri, Peshawar" },
  { supplierID: "SID002", firstName: "Ahmed", lastName: "Khan", DOB: new Date("1982-07-22"), email: "ahmed@abbottkhyber.pk", contactNo: 3331234567, NIC: "17301-7654321-1", address: "University Road, Peshawar" },
  { supplierID: "SID003", firstName: "Tariq", lastName: "Shah", DOB: new Date("1975-11-08"), email: "tariq@getzpharma.pk", contactNo: 3451122334, NIC: "17301-2345678-9", address: "Saddar Bazaar, Peshawar Cantt" },
  { supplierID: "SID004", firstName: "Imran", lastName: "Afridi", DOB: new Date("1985-05-20"), email: "imran@sanofipk.com", contactNo: 3009988776, NIC: "17301-8765432-5", address: "Hayatabad Phase 5, Peshawar" },
  { supplierID: "SID005", firstName: "Faisal", lastName: "Yousafzai", DOB: new Date("1980-09-12"), email: "faisal@pfizerdist.pk", contactNo: 3121456789, NIC: "17301-3456789-7", address: "Charsadda Road, Peshawar" },
  { supplierID: "SID006", firstName: "Noman", lastName: "Durrani", DOB: new Date("1988-01-30"), email: "noman@horizonpharma.pk", contactNo: 3461789012, NIC: "17301-9876543-2", address: "Board Bazaar, Peshawar" },
  { supplierID: "SID007", firstName: "Waqas", lastName: "Mohmand", DOB: new Date("1990-06-18"), email: "waqas@merckpk.com", contactNo: 3551234568, NIC: "17301-1234567-4", address: "Dalazak Road, Peshawar" },
  { supplierID: "SID008", firstName: "Rahim", lastName: "Khattak", DOB: new Date("1983-12-05"), email: "rahim@novartispk.com", contactNo: 3019876541, NIC: "17301-6543219-8", address: "Ring Road, Hayatabad, Peshawar" },
];

// ── 3. EMPLOYEES — 6 pharmacy staff ─────────────────────────────────────────
const employees = [
  { empId: "EMP001", name: "Usman Gul", contactNo: 3211234567, DOB: new Date("1995-04-10"), address: "Hayatabad Phase 3, Peshawar", email: "usman@khyberpharmacy.pk", NIC: 1730156789012, empRole: "Pharmacist", maritalStatus: "Married", gender: "Male" },
  { empId: "EMP002", name: "Ayesha Bibi", contactNo: 3339876543, DOB: new Date("1998-08-25"), address: "University Town, Peshawar", email: "ayesha@khyberpharmacy.pk", NIC: 1730198765432, empRole: "Cashier", maritalStatus: "Single", gender: "Female" },
  { empId: "EMP003", name: "Kamran Ali", contactNo: 3451122337, DOB: new Date("1992-01-15"), address: "Saddar, Peshawar Cantt", email: "kamran@khyberpharmacy.pk", NIC: 1730112345678, empRole: "Store Manager", maritalStatus: "Married", gender: "Male" },
  { empId: "EMP004", name: "Bilal Khan", contactNo: 3001234560, DOB: new Date("1997-11-03"), address: "Board Bazaar, Peshawar", email: "bilalk@khyberpharmacy.pk", NIC: 1730145678901, empRole: "Cashier", maritalStatus: "Single", gender: "Male" },
  { empId: "EMP005", name: "Saima Noor", contactNo: 3127654321, DOB: new Date("1994-06-20"), address: "Gulbahar, Peshawar", email: "saima@khyberpharmacy.pk", NIC: 1730167890123, empRole: "Pharmacist", maritalStatus: "Married", gender: "Female" },
  { empId: "EMP006", name: "Zubair Ahmad", contactNo: 3467890123, DOB: new Date("2000-02-14"), address: "Warsak Road, Peshawar", email: "zubair@khyberpharmacy.pk", NIC: 1730178901234, empRole: "Stock Clerk", maritalStatus: "Single", gender: "Male" },
];

// ── 4. SALARY RECORDS — last 2 months for each employee ─────────────────────
const salaryRecords = [];
for (const emp of employees) {
  for (const month of ["2026-01", "2026-02"]) {
    salaryRecords.push({
      empId: emp.empId,
      name: emp.name,
      contactNo: emp.contactNo,
      DOB: emp.DOB,
      address: emp.address,
      email: emp.email,
      NIC: emp.NIC,
      empRole: emp.empRole,
    });
  }
}

// ── 5. LEAVE RECORDS — a few recent leaves ──────────────────────────────────
const leaveRecords = [
  { empId: "EMP001", name: "Usman Gul", contactNo: 3211234567, DOB: new Date("1995-04-10"), address: "Hayatabad Phase 3, Peshawar", email: "usman@khyberpharmacy.pk", NIC: 1730156789012, empRole: "Pharmacist" },
  { empId: "EMP004", name: "Bilal Khan", contactNo: 3001234560, DOB: new Date("1997-11-03"), address: "Board Bazaar, Peshawar", email: "bilalk@khyberpharmacy.pk", NIC: 1730145678901, empRole: "Cashier" },
  { empId: "EMP006", name: "Zubair Ahmad", contactNo: 3467890123, DOB: new Date("2000-02-14"), address: "Warsak Road, Peshawar", email: "zubair@khyberpharmacy.pk", NIC: 1730178901234, empRole: "Stock Clerk" },
];

// ── 6. SUPPLY REQUESTS — 5 pending/in-progress orders ───────────────────────
const supplyRequests = [
  { medicineName: "Augmentin 625mg", quantity: 200, supplier: "GSK Pakistan", status: "Pending" },
  { medicineName: "Insulin Mixtard 30", quantity: 50, supplier: "Novo Nordisk", status: "Pending" },
  { medicineName: "Ventolin Inhaler", quantity: 30, supplier: "GSK Pakistan", status: "Approved" },
  { medicineName: "Nexium 40mg", quantity: 100, supplier: "AstraZeneca", status: "Pending" },
  { medicineName: "Glucophage 500mg", quantity: 150, supplier: "Merck Pakistan", status: "Approved" },
];

// ── 7. SALES — Generate 30 realistic \"today\" + 70 historical sales ────────
function buildSales(inventoryDocs) {
  const sales = [];
  const customerNames = [
    "Walk-in Customer", "Walk-in Customer", "Walk-in Customer", // most are walk-ins
    "Haji Noor Muhammad", "Mrs. Zainab", "Dr. Farid Ullah",
    "Sajid Khan", "Rabia Gul", "Zeeshan Ahmad",
    "Muhammad Irfan", "Nasreen Bibi", "Aurangzeb Khan",
    "Mehmood Shah", "Sadia Afridi", "Hamza Yousafzai",
  ];
  const cashiers = ["Ayesha Bibi", "Bilal Khan", "Admin"];
  const paymentMethods = ["Cash", "Cash", "Cash", "Cash", "JazzCash", "Card"];

  // Helper: pick random medicines for a sale
  const makeSale = (dateOffset, isToday) => {
    const numItems = rand(1, 5);
    const selectedMeds = [];
    const usedIds = new Set();

    for (let i = 0; i < numItems; i++) {
      let med;
      do { med = pick(inventoryDocs); } while (usedIds.has(med._id.toString()));
      usedIds.add(med._id.toString());
      const qty = rand(1, 4);
      selectedMeds.push({
        medicineId: med._id,
        medicineName: med.Mname,
        quantity: qty,
        unitPrice: med.Mprice,
        costPrice: med.McostPrice || 0,
        total: med.Mprice * qty,
      });
    }

    const subtotal = selectedMeds.reduce((s, it) => s + it.total, 0);
    const hasDiscount = Math.random() < 0.25;
    const discount = hasDiscount ? rand(1, 3) * 5 : 0; // 5, 10, or 15 Rs
    const grandTotal = Math.max(subtotal - discount, 0);
    const amountPaid = Math.ceil(grandTotal / 10) * 10; // round up to nearest 10

    const saleDate = new Date();
    if (isToday) {
      // Spread across today's hours (8am–9pm)
      saleDate.setHours(rand(8, 21), rand(0, 59), rand(0, 59));
    } else {
      saleDate.setDate(saleDate.getDate() - dateOffset);
      saleDate.setHours(rand(8, 21), rand(0, 59), rand(0, 59));
    }

    const dayStr = `${saleDate.getFullYear()}${String(saleDate.getMonth() + 1).padStart(2, "0")}${String(saleDate.getDate()).padStart(2, "0")}`;

    return {
      invoiceNumber: `INV-${dayStr}-${String(rand(1, 9999)).padStart(4, "0")}`,
      items: selectedMeds,
      subtotal,
      discount,
      discountType: "fixed",
      tax: 0,
      grandTotal,
      amountPaid,
      change: amountPaid - grandTotal,
      paymentMethod: pick(paymentMethods),
      customerName: pick(customerNames),
      customerPhone: Math.random() < 0.3 ? `03${rand(10, 99)}${rand(1000000, 9999999)}` : null,
      soldBy: pick(cashiers),
      notes: null,
      status: "Completed",
      createdAt: saleDate,
      updatedAt: saleDate,
    };
  };

  // 30 sales TODAY (for the Z-Report & dashboard to look great)
  for (let i = 0; i < 30; i++) {
    sales.push(makeSale(0, true));
  }

  // 70 historical sales across last 14 days
  for (let i = 0; i < 70; i++) {
    sales.push(makeSale(rand(1, 14), false));
  }

  return sales;
}

// ── 8. NOTIFICATIONS ────────────────────────────────────────────────────────
const notifications = [
  { message: "Low stock alert: Imodium 2mg — only 8 strips remaining" },
  { message: "Low stock alert: Nexium 40mg — only 5 strips remaining" },
  { message: "Low stock alert: Insulin Mixtard 30 — only 3 injections remaining" },
  { message: "Expiry alert: Expired Cough Syrup [DEMO] expired on 15-Feb-2026" },
  { message: "Expiry alert: Near-Expiry Paracetamol [DEMO] expires on 05-Apr-2026" },
  { message: "New supply request: Augmentin 625mg x200 — awaiting approval" },
  { message: "System: Database seeded with Peshawar demo data" },
];

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════
const megaSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ Connected to MongoDB\n");

    // ── Clear all collections ──────────────────────────────────────────────
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      Inventory.deleteMany({}),
      Sale.deleteMany({}),
      Supplier.deleteMany({}),
      Employee.deleteMany({}),
      EmployeeSalary.deleteMany({}),
      EmployeeLeave.deleteMany({}),
      SupplyRequest.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("   Done — all collections cleared.\n");

    // Drop unique barcode index if it exists (avoids duplicate key errors)
    try { await Inventory.collection.dropIndex("generatedBarcode_1"); } catch (_) { /* ok */ }

    // ── Seed Inventory ─────────────────────────────────────────────────────
    const now = new Date();
    const inventoryDocs = medicines.map((med, i) => ({
      ...med,
      expirAt: med.expirAt || new Date(now.getFullYear() + 1, rand(0, 11), rand(1, 28)),
      manuAt: new Date(now.getFullYear() - 1, rand(0, 11), rand(1, 28)),
      status: med.status || "Available",
      imageUrl: `https://via.placeholder.com/150?text=${encodeURIComponent(med.Mname.split(" ")[0])}`,
      generatedBarcode: `KMP${String(i + 1).padStart(10, "0")}`,
      batchNumber: `BPWR-${now.getFullYear()}-${String(i + 1).padStart(4, "0")}`,
      shelfLocation: `${pick(["A", "B", "C", "D"])}${rand(1, 5)}-${rand(1, 3)}`,
      reorderLevel: rand(15, 30),
    }));
    const insertedMeds = await Inventory.insertMany(inventoryDocs);
    console.log(`📦 Inventory: ${insertedMeds.length} medicines added`);

    // ── Seed Suppliers ─────────────────────────────────────────────────────
    await Supplier.insertMany(suppliers);
    console.log(`🏭 Suppliers: ${suppliers.length} added`);

    // ── Seed Employees ─────────────────────────────────────────────────────
    await Employee.insertMany(employees);
    console.log(`👷 Employees: ${employees.length} added`);

    // ── Seed Salary Records ────────────────────────────────────────────────
    await EmployeeSalary.insertMany(salaryRecords);
    console.log(`💰 Salary records: ${salaryRecords.length} added`);

    // ── Seed Leave Records ─────────────────────────────────────────────────
    await EmployeeLeave.insertMany(leaveRecords);
    console.log(`🏖️  Leave records: ${leaveRecords.length} added`);

    // ── Seed Supply Requests ───────────────────────────────────────────────
    await SupplyRequest.insertMany(supplyRequests);
    console.log(`📋 Supply requests: ${supplyRequests.length} added`);

    // ── Seed Sales ─────────────────────────────────────────────────────────
    const salesData = buildSales(insertedMeds);
    await Sale.insertMany(salesData);
    const todaySales = salesData.filter(s => {
      const d = new Date(s.createdAt);
      return d.toDateString() === new Date().toDateString();
    });
    const todayRev = todaySales.reduce((s, sale) => s + sale.grandTotal, 0);
    console.log(`🧾 Sales: ${salesData.length} total (${todaySales.length} today — Rs. ${todayRev.toLocaleString()})`);

    // ── Seed Notifications ─────────────────────────────────────────────────
    await Notification.insertMany(notifications);
    console.log(`🔔 Notifications: ${notifications.length} added`);

    // ── Summary ────────────────────────────────────────────────────────────
    const totalValue = inventoryDocs.reduce((s, m) => s + m.Mprice * m.Mquantity, 0);
    console.log("\n═══════════════════════════════════════════════");
    console.log("  🎯 PESHAWAR PHARMACY MEGA SEED — COMPLETE");
    console.log("═══════════════════════════════════════════════");
    console.log(`  📦 Medicines:       ${insertedMeds.length}`);
    console.log(`  💰 Inventory Value: Rs. ${totalValue.toLocaleString()}`);
    console.log(`  🧾 Sales Records:   ${salesData.length}`);
    console.log(`  🏭 Suppliers:       ${suppliers.length}`);
    console.log(`  👷 Employees:       ${employees.length}`);
    console.log(`  💵 Salary Records:  ${salaryRecords.length}`);
    console.log(`  🏖️  Leave Records:   ${leaveRecords.length}`);
    console.log(`  📋 Supply Requests: ${supplyRequests.length}`);
    console.log(`  🔔 Notifications:   ${notifications.length}`);
    console.log("═══════════════════════════════════════════════");
    console.log("  Ready for Hayatabad / University Town demo! 🚀\n");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

megaSeed();
