# 💊 KMP Pharmacy Management System — Peshawar Edition
## Complete Demo & Pitch Document for Hayatabad Phase 4 Pharmacies

---

## 🎯 EXECUTIVE SUMMARY

**What is this?**  
A fully digital, cloud-ready pharmacy management system built specifically for pharmacies in Peshawar — covering Hayatabad Medical Complex (HMC), Rehman Medical Institute (RMI), Northwest General Hospital (NWGH), and surrounding Phase 4 area pharmacies.

**Problem it solves:**  
- Manual register/notebook billing → Instant POS with barcode scanning
- No expiry tracking → Automated alerts 30/60/90 days before expiry
- Cash leakage / miscounting → Digital receipts, audit trail, exact change calculation
- No stock visibility → Real-time inventory with reorder level alerts
- No sales data → Complete analytics: daily, weekly, monthly revenue/profit

**Tech Stack:** MERN (MongoDB, Express, React, Node.js) — Modern, fast, mobile-ready

---

## 🖥️ SYSTEM FEATURES AT A GLANCE

### 1. Point of Sale (POS) — `/pos`
- **Barcode Scanner Support**: Plug in any USB barcode scanner — it auto-detects rapid keystrokes and searches medicines instantly
- **Manual Search**: Type medicine name or partial name — results appear in real-time
- **Cart System**: Add medicines, adjust quantities with +/- buttons, remove items
- **Payment Methods**: Cash (PKR), Card, JazzCash/Easypaisa (Mobile), Udhar (Credit)
- **Quick Amount Buttons**: Rs. 500, 1000, 2000, 5000 — single click for fast billing
- **Discount System**: Fixed amount or percentage-based discounts
- **Instant Receipt**: Digital receipt with print-ready thermal printer format
- **Keyboard Shortcuts**: F1=New Sale, F2=Search, F12=Checkout, Esc=Clear
- **Auto Stock Deduction**: When sale completes, inventory quantity is automatically reduced
- **Audio Feedback**: Beep sounds for barcode scans and checkout

### 2. Admin Dashboard — `/admin-dashboard`
- **Live Stats**: Today's revenue, weekly trends, total medicines, alerts count
- **Expiry Alerts Banner**: Red banner for expired medicines, orange for expiring soon
- **Top Selling Items**: Live chart of best-selling medicines today
- **Low Stock Alerts**: Items below reorder level highlighted
- **Expiry Breakdown**: Visual breakdown of expired/30-day/60-day/90-day items
- **Auto-refresh**: Data refreshes every 30 seconds

### 3. Inventory Management — `/inventory-management`
- **Full Medicine Database**: Name, price, cost price, quantity, supplier, batch number
- **Barcode Fields**: Factory barcode (from manufacturer) + auto-generated system barcode
- **Expiry Tracking**: Manufacture date, expiry date, status (Active/Expired/Pending)
- **Storage Conditions**: Room Temperature, Refrigerated, Cool & Dry, etc.
- **Medicine Types**: Tablet, Capsule, Syrup, Injection, Cream, Drops, Inhaler, etc.
- **Unit Support**: Strip, Bottle, Tube, Box, Packet, etc.
- **Reorder Level**: Set minimum stock threshold — get alerted when stock runs low
- **Shelf Location**: Track where each medicine is stored (Shelf A1, B2, etc.)
- **PDF Reports**: Download complete inventory report as PDF

### 4. Expiry Alerts — `/expiry-alerts`
- **4 Alert Categories**: Expired, Expiring in 30 days, 60 days, 90 days
- **Value at Risk**: Total PKR value of medicines at risk of expiry
- **Search & Filter**: Find specific medicines across all alert categories
- **CSV Export**: Download expiry data for insurance/DRAP reporting
- **Recommended Actions**: System suggests what to do with each category

### 5. Sales History & Analytics — `/sales-history`
- **Today's Summary**: Revenue, profit, margins, top seller
- **Date Range Filtering**: View sales for any custom period
- **Payment Breakdown**: Cash vs Card vs Mobile vs Credit analysis
- **Invoice Lookup**: Search any past invoice, view details, reprint receipt
- **Export**: Download sales data as CSV for accounting

### 6. Supplier Management — `/supplier-management`
- **Supplier Database**: Name, contact person, address, phone, email
- **Order Management**: Track orders from suppliers
- **PDF Reports**: Generate supplier reports
- **CRUD Operations**: Create, Read, Update, Delete suppliers

### 7. Prescription Management — `/prescription-management`
- **Digital Prescriptions**: Store patient name, medication, dosage, units
- **Assignment System**: Assign prescriptions to pharmacy staff
- **Inventory Check**: Quick link to verify medicine availability
- **Payment Integration**: Link prescriptions to payment tracking

### 8. Employee Management — `/employee-management`
- **Employee Database**: Name, email, NIC (CNIC), contact, gender, role
- **Salary Management**: Assign and track salaries by role
- **Leave Management**: Employee leave request tracking
- **Job Roles**: Delivery Manager, Supplier Manager, Prescription Manager, Inventory Manager, etc.
- **PDF Reports**: Employee reports for records

### 9. Delivery Management — `/delivery-management`
- **Task Management**: Create delivery tasks, assign to drivers
- **Driver Database**: Track drivers, availability, license validity
- **Status Tracking**: Task Count, Delivered, Available Drivers
- **Driver Authentication**: Separate login for delivery drivers

### 10. Promotions & Discounts — `/promotion-management`
- **Coupon System**: Create coupon codes with expiry dates
- **Offer Types**: Total Offers, Active Offers, Inactive Offers tracking
- **Customer Feedback**: Collect and manage customer reviews/ratings

### 11. User Management — `/user-management`
- **Customer Accounts**: Registered users with profile management
- **Order History**: Track customer purchase history
- **User Authentication**: Secure sign-in/sign-up with Google OAuth option

---

## 🚀 HOW TO START THE DEMO

### Step 1: Start Backend Server
```powershell
# Kill any existing process on port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Start server
cd "c:\Alia Rehman Work\Muz_Work\pharmacy-management\server"
node server.js
```
You should see: `Server is running on port 3000` and `MongoDB connected!`

### Step 2: Start Frontend
```powershell
cd "c:\Alia Rehman Work\Muz_Work\pharmacy-management\client"
npm run dev
```
Open browser: `http://localhost:5173` (or 5174)

### Step 3: Seed Database (if inventory is empty)
```powershell
cd "c:\Alia Rehman Work\Muz_Work\pharmacy-management\server"
node seedDatabase.js
```
This loads 21 Pakistani medicines worth Rs. 526,500 into the system.

### Step 4: Login
- Go to `http://localhost:5174/employee-sign-in`
- Email: `admin@pharmacy.pk`
- NIC: `4230112345678`

---

## 🎤 DEMO SCRIPT (For Hayatabad Phase 4 Pitch)

### Opening (2 minutes)
**Urdu/English Mix:**

> "Assalam-o-Alaikum! Main aapko dikhata hoon ke yeh system aapki pharmacy ko kaise digitize karega. Abhi aap register mein likhtey hain, cash counter pe manually calculate kartey hain — humara system yeh sab automate kar deta hai. Chalein start kartey hain..."

### Demo Flow (10-15 minutes)

#### 1. Dashboard (2 min)
- Show the dark, professional dashboard
- Point out: "Dekho, Rs. 526,500 ka stock hai — sab ek nazar mein"
- Show expiry alert: "1 medicine expired hai — system ne automatically detect kia"
- "Yeh 30 second baad khud refresh hota hai"

#### 2. POS Billing (3 min) — THE STAR OF THE SHOW
- Click "Open POS" or go to Point of Sale
- Type "Pan" in search → Panadol appears
- Click to add to cart → quantity 2
- Search "Amox" → Amoxicillin appears → add
- Show total automatically calculated
- Select "Cash" → type amount paid → see change calculated
- Click "Complete Sale" → Receipt appears
- "Print" button → thermal printer format opens
- "Dekho, 30 second mein sale complete ho gayi — receipt bhi print"

#### 3. Barcode Scanner (1 min)
- "Agar aapke paas barcode scanner hai, plug in karo — scan karo — medicine automatic aa jayegi"
- "USB scanner laga ke — beep — medicine cart mein"

#### 4. Expiry Tracking (2 min)
- Go to Expiry Alerts
- "Dekho, expired medicines red mein hain"
- "30 din mein expire honay wali orange mein"
- "Value at risk dikhata hai — kitne ka stock waste hone wala hai"
- "CSV download karein for DRAP reporting"

#### 5. Sales History (2 min)
- Go to Sales History
- Show today's revenue, profit, margins
- "Har invoice ka record hai — kabhi bhi dekh saktey hain"
- "Accountant ko CSV export kar ke de do"

#### 6. Inventory (2 min)
- Go to Inventory Management
- "Sari medicines yahan hain — price, quantity, batch number, expiry"
- Click "+ Add Medicine" → show the form
- "Nai medicine aayi? 30 second mein add karo"
- "Reorder level set karo — stock kam ho toh alert aayega"

### Closing (2 min)
> "Aap dekh saktey hain — yeh system aapki poori pharmacy ko digital kar deta hai. Billing fast ho jaati hai, expiry waste khatam, cash handling accurate, aur saari reporting automatic. Hayatabad mein pehli pharmacy jo fully digital ho — woh aapka ho sakta hai."

---

## 💰 PRICING SUGGESTION (For Pitch)

| Package | Price | Includes |
|---------|-------|----------|
| Basic Setup | Rs. 30,000 | Software installation, 21-medicine seed, 1 hour training |
| Standard | Rs. 50,000 | Basic + barcode scanner hardware, 3 months support |
| Premium | Rs. 80,000 | Standard + thermal printer, cloud backup, 1 year support |
| Monthly SaaS | Rs. 5,000/month | Everything hosted, updates, support, backup |

**Hardware Needed (sold separately or bundled):**
- USB Barcode Scanner: Rs. 2,000-5,000
- Thermal Receipt Printer (58mm/80mm): Rs. 5,000-12,000
- Basic Laptop/Desktop: Already available at pharmacy

---

## 🛡️ KEY SELLING POINTS FOR PESHAWAR PHARMACIES

### Why This vs. Manual?
| Manual System | Our System |
|---------------|------------|
| Notebook billing — 2-3 min per sale | POS billing — 30 seconds |
| No expiry tracking, medicines waste | Automated expiry alerts 30/60/90 days |
| Cash counting errors | Exact change calculation |
| No sales record next day | Complete history, any date, any invoice |
| Supplier stock guesswork | Reorder level alerts |
| No reports for tax/DRAP | PDF & CSV reports instant |
| Staff can pocket cash | Every sale has digital receipt trail |

### Why This vs. Competitors?
1. **Built for Pakistan**: PKR currency, CNIC-based login, Pakistani medicine names, local suppliers
2. **Barcode + Manual**: Works with or without barcode scanner (many Pakistani medicines don't have barcodes)
3. **Offline-Ready**: MongoDB runs locally — no internet needed for daily operations
4. **Urdu-Friendly**: Designed with Pakistan's pharmacy naming conventions
5. **Low Cost**: No expensive ERP licenses — one-time setup
6. **Modern UI**: Professional dark theme — looks premium on any screen
7. **Open Source Base**: Can be customized for any specific pharmacy need

### DRAP Compliance Ready
- Track batch numbers for every medicine
- Expiry date management (mandatory in Pakistan)
- Supplier records for audit trail
- Sales records for tax reporting

---

## 🎯 TARGET CUSTOMERS IN HAYATABAD PHASE 4

1. **Medical Store near HMC** — High volume, needs fast POS
2. **Pharmacy near RMI** — Prescription management + inventory
3. **NWGH area pharmacies** — Delivery management for home deliveries
4. **Phase 4 retail pharmacies** — Full system for daily operations
5. **Wholesale medicine distributors** — Supplier + inventory management

---

## ⚙️ TECHNICAL REQUIREMENTS

- **Server**: Any PC/laptop with Node.js 18+ installed
- **Database**: MongoDB (free Community edition)
- **Browser**: Chrome/Edge/Firefox (any modern browser)
- **Network**: Local network only (no internet required for daily use)
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 1GB for software + database growth

---

## 🔑 LOGIN CREDENTIALS

| Role | URL | Email | Password/NIC |
|------|-----|-------|-------------|
| Admin/Employee | `/employee-sign-in` | admin@pharmacy.pk | 4230112345678 |
| Customer | `/sign-in` | (create via sign-up) | (password-based) |

---

## 📋 PRE-DEMO CHECKLIST

- [ ] MongoDB running (`mongod` service)
- [ ] Backend server running on port 3000
- [ ] Frontend running on port 5173/5174
- [ ] Database seeded (21 medicines visible in inventory)
- [ ] Login tested (admin@pharmacy.pk + 4230112345678)
- [ ] Open browser in full screen
- [ ] Hide bookmark bar (F11 for fullscreen)
- [ ] Have at least 1 test sale completed to show in Sales History
- [ ] USB barcode scanner connected (if available for demo)
- [ ] Thermal printer connected (if available for demo)

---

## ⚠️ DEMO TIPS — DO's and DON'Ts

### DO's ✅
- Start with Dashboard — impressive at first glance
- Demo POS immediately — this is what sells
- Show the expiry alerts — this is the "aha moment" for pharmacy owners
- Print a receipt if printer is available
- Mention PKR, CNIC, Pakistani medicine names — show it's local
- Use F-key shortcuts in POS to look professional

### DON'Ts ❌
- Don't try to create complex data during demo — use seeded data
- Don't show the browser console/dev tools
- Don't navigate to pages you haven't tested
- Don't promise mobile app (it's web-based, but mobile-responsive)
- Don't show the code or VS Code during demo

---

## 📱 FUTURE ROADMAP (Mention if asked)

1. **Mobile App** — React Native version for phone-based billing
2. **Cloud Hosting** — Access pharmacy data from anywhere
3. **Multi-Branch** — Manage multiple pharmacy locations
4. **WhatsApp Integration** — Send receipts via WhatsApp
5. **AI Predictions** — Predict which medicines will sell next month
6. **Urdu Language** — Full Urdu interface option
7. **SMS Alerts** — Send expiry alerts via SMS to pharmacy owner

---

## 📞 SUPPORT & CONTACT

**Developer**: Muzammil  
**GitHub**: https://github.com/muz4miL/hospital  
**System**: KMP Pharmacy Management System — Peshawar Edition  

---

*This document is confidential and intended for pitch/demo purposes only.*
*Last updated: March 2026*
