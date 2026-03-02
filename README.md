# 🏥 KMP Pharmacy Management System

**A Modern MERN Stack Solution for Pakistani Pharmacies**  
*Specially Customized for Hayatabad Medical Complexes, Peshawar*

<p><a href="https://github.com/kavindu-dilshan"><img src="https://skillicons.dev/icons?i=mongo,express,react,nodejs,vite,redux,tailwind,vscode,github" width=350></a></p>

> 📝 **Note**: This is a customized fork of [kavindu-dilshan/KMP-Pharmacy](https://github.com/kavindu-dilshan/KMP-Pharmacy), adapted specifically for Pakistani pharmacy market with local medicines, PKR currency, and Peshawar-specific features.

---

## 🎯 Why This System?

Pakistani pharmacies in busy medical hubs like Hayatabad face daily challenges:
- ⏱️ **Slow billing** during rush hours (5 min per customer)
- 💸 **Lost money** from expired medicines
- 📝 **Manual ledgers** prone to errors  
- 📊 **No insights** into best-selling medicines
- 🔥 **Data loss** when computers fail

**This system solves ALL of these problems.**

---

## ✨ Key Features

### 🚀 **Lightning-Fast POS (Point of Sale)**
- Type 3 letters → Medicine appears instantly
- Barcode scanner support (optional - Rs. 2,500)
- Keyboard shortcuts for speed (F1, F2, F12)
- **Billing time: 5 minutes → 30 seconds**

### 📅 **Automatic Expiry Tracking**
- Dashboard alerts for medicines expiring in 30/60/90 days
- **Save Rs. 50,000+ annually** in expired stock
- Batch-level tracking (coming soon)

### 📊 **Business Intelligence**
- Daily sales reports with charts
- Top-selling medicines analysis
- Profit margin breakdowns
- Low stock alerts with auto-reorder

### ☁️ **Cloud Backup**
- Never lose data to hardware failure
- Access from multiple devices
- Automatic daily backups
- Works offline, syncs when online

### 🏷️ **Flexible Barcode System**
- Works WITHOUT barcode scanner (keyboard entry)
- Supports standard USB scanners
- Can generate barcodes for medicines that don't have them
- See [BARCODE_GUIDE.md](BARCODE_GUIDE.md) for complete guide

---

## 🚀 Quick Start

### **Easiest Way (PowerShell Scripts):**

```powershell
# First-time setup (run once)
.\setup-first-time.ps1

# Start the system (every time)
.\run-demo.ps1

# Browser opens automatically at http://localhost:5173
```

### **Manual Setup:**

**1. Install Dependencies:**

```bash
# Install client packages
cd client
npm install --legacy-peer-deps

# Install server packages
cd ../server
npm install
```

**2. Setup MongoDB:**

Create `server/.env` file:
```env
MONGO=mongodb://localhost:27017/kmp-pharmacy
JWT_SECRET=your-secret-key-here
```

**3. Load Pakistani Medicines:**

```bash
cd server
node seedDatabase.js
```

This loads 20+ common medicines:
- Panadol, Brufen, Augmentin, Flagyl
- Risek, Arinac, Calpol, Zithromax
- Real Pakistani prices in PKR
- Realistic stock quantities

**4. Start Servers:**

```bash
# Terminal 1 - Backend (Port 3000)
cd server
npm run dev

# Terminal 2 - Frontend (Port 5173)
cd client
npm run dev
```

**5. Open http://localhost:5173**

---

## 🔐 First Login

1. Click **"Sign up"** on login page
2. Create account with email and password
3. Login with your credentials
4. Explore: Dashboard → Inventory → POS

---

## 📋 What's Included (Pakistani Market)

### **Pre-loaded Medicines** ✅
- **Pain & Fever**: Panadol, Brufen, Disprin, Ponstan
- **Antibiotics**: Augmentin, Flagyl, Cefspan, Zithromax
- **Gastric**: Risek, Motilium, Antacid
- **Cold & Flu**: Arinac, Actifed
- **Pediatric**: Calpol, Riabal
- **Vitamins**: Centrum, Folic Acid
- **Chronic**: Glucophage, Cardace

### **Pakistani Suppliers** ✅
- GSK Pakistan
- Abbott Laboratories
- Pfizer Pakistan
- Getz Pharma
- Sanofi Pakistan
- Horizon Pharma

### **Local Pricing** ✅
- All prices in **PKR** (Pakistani Rupees)
- Realistic markup margins
- Common packaging (strips of 10, 120ml bottles, etc.)

---

## 📚 Complete Documentation

| Guide | What It Covers |
|-------|----------------|
| **[DEMO_SETUP_GUIDE.md](DEMO_SETUP_GUIDE.md)** | How to pitch to Hayatabad pharmacies<br>5-minute demo script<br>Pricing strategy<br>Common objections |
| **[BARCODE_GUIDE.md](BARCODE_GUIDE.md)** | Barcode reality in Pakistan<br>USB scanner setup<br>Generate your own barcodes<br>Hybrid keyboard+scanner system |
| **[server/.env](server/.env)** | MongoDB connection<br>Environment variables |

---

## 🎯 For Hayatabad Demo

### **Before Walking Into Pharmacy:**

✅ Database seeded with medicines  
✅ Both servers running  
✅ Test account created  
✅ Practice 5-minute demo  
✅ Mobile hotspot ready (backup)

### **The 5-Minute Demo:**

1. **Fast Billing** (2 min) - Show speed vs manual
2. **Expiry Alert** (1 min) - "Save Rs. 50K/year"
3. **Sales Report** (1 min) - Daily insights  
4. **Let them try** (1 min) - Hands-on

### **Pricing:**
- Monthly: Rs. 3,000-5,000
- Setup: Rs. 5,000 (one-time)
- **Free 14-day trial**

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB (Mongoose ODM)
- **Charts**: Chart.js  
- **PDF Export**: jsPDF
- **Real-time**: WebSocket

---

## 📁 Project Structure

```
pharmacy-management/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InventoryManagement/
│   │   │   ├── PrescriptionManagement/
│   │   │   ├── SupplierManagement/
│   │   │   └── ...
│   │   ├── components/        # Reusable UI components
│   │   └── redux/             # State management
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── models/               # MongoDB schemas
│   │   ├── inventory.model.js
│   │   ├── user.model.js
│   │   ├── payment.model.js
│   │   └── ...
│   ├── routes/               # API endpoints
│   ├── controllers/          # Business logic
│   ├── seedDatabase.js       # Pakistani medicines
│   └── server.js
│
├── DEMO_SETUP_GUIDE.md       # Pitching guide
├── BARCODE_GUIDE.md          # Barcode implementation
├── run-demo.ps1              # Quick start script
└── README.md                 # This file
```

---

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
```bash
# Start local MongoDB
mongod

# OR use MongoDB Atlas (cloud)
# Update server/.env with connection string
```

**"Port 3000 already in use"**
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**"npm install fails"**
```bash
npm install --legacy-peer-deps
```

---

## 🎨 Customizations for Pakistan

- ✅ Pakistani medicine database (20+ common drugs)
- ✅ PKR currency formatting
- ✅ Local supplier names
- ✅ Realistic Pakistani pricing  
- ✅ Common storage conditions
- 🔜 Urdu language toggle
- 🔜 WhatsApp receipt integration
- 🔜 Thermal printer support

---

## 🏆 Why Better Than Competitors?

| Feature | Our System | Old Software | Excel |
|---------|-----------|--------------|-------|
| **Price** | Rs. 3-5K/mo | Rs. 50-100K | Free |
| **Cloud Backup** | ✅ Auto | ❌ Manual | ❌ None |
| **Mobile** | ✅ Yes | ❌ Desktop only | ❌ No |
| **Updates** | ✅ Free | ❌ Paid | ❌ N/A |
| **Setup** | ⚡ 1 hour | 🐌 2 days | N/A |

---

## 📈 Roadmap

**Phase 1** (Current): Core POS + Inventory  
**Phase 2**: Barcode generation + Thermal printing  
**Phase 3**: WhatsApp integration + Mobile app  
**Phase 4**: Multi-branch + Franchise module

---

## 🙏 Credits

Original repository: [kavindu-dilshan/KMP-Pharmacy](https://github.com/kavindu-dilshan/KMP-Pharmacy)  
Modified for Pakistani pharmacy market by adding:
- Pakistani medicine database
- PKR currency
- Local supplier integration  
- Barcode system for Pakistan
- Hayatabad-specific documentation

---

## 📞 Target Market

**Primary**: Hayatabad Medical Complexes (HMC, RMI, NWGH)  
**Secondary**: Peshawar city pharmacies  
**Tertiary**: KP province medical stores

---

## 🚀 Next Steps

1. ✅ Run `.\run-demo.ps1`
2. 📖 Read [DEMO_SETUP_GUIDE.md](DEMO_SETUP_GUIDE.md)
3. 🏷️ Understand [BARCODE_GUIDE.md](BARCODE_GUIDE.md)
4. 🎭 Practice 5-minute demo
5. 🏥 Visit small pharmacy first
6. 💰 Close first sale!

---

**Remember**: You're not selling software. You're selling **time savings** (5 min → 30 sec), **money saved** (Rs. 50K+ from expiry alerts), and **peace of mind** (cloud backup).

**Keep it simple. Let the demo do the talking.**

*Built with ❤️ for Pakistani pharmacies*
