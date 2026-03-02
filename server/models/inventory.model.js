import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    Mname: { 
      type: String,
      required: true,
      index: true,
    },
    Mprice: {
      type: Number,
      required: true,
    },
    Mquantity: {
      type: Number,
      required: true,
    },
    McostPrice: {
      type: Number,
      default: 0,
    },
    Msupplier: {
      type: String,
      required: true,
    },
    expirAt: {
      type: Date,
      required: true,
    },
    manuAt: {
      type: Date,
      required: true,
    },
    storageCondition: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150?text=Medicine',
    },
    // Barcode fields
    factoryBarcode: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    generatedBarcode: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    // Additional pharmacy fields
    batchNumber: {
      type: String,
      default: null,
    },
    reorderLevel: {
      type: Number,
      default: 20,
    },
    unit: {
      type: String,
      default: 'Strip',
      enum: ['Strip', 'Bottle', 'Tube', 'Box', 'Packet', 'Tablet', 'Capsule', 'Injection', 'Syrup', 'Cream', 'Drops', 'Inhaler', 'Sachet', 'Other'],
    },
    packSize: {
      type: String,
      default: null,
    },
    shelfLocation: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate barcode before saving
inventorySchema.pre('save', function(next) {
  if (!this.factoryBarcode && !this.generatedBarcode) {
    this.generatedBarcode = `KMP${Date.now().toString().slice(-10)}`;
  }
  next();
});

// Text index for fast search
inventorySchema.index({ Mname: 'text', type: 'text', Msupplier: 'text' });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;