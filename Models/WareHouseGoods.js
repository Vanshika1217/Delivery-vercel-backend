const mongoose = require("mongoose");
const goodsSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    price: Number,
    stock: Number,
    warehouseLocation: {
      type: { type: String, default: "Point" },
      coordinates: [Number]
    },
    image: String,
    isAvailable: { type: Boolean, default: true }
  });
  
  goodsSchema.index({ warehouseLocation: "2dsphere" });
  
  module.exports = mongoose.model("Goods", goodsSchema);
  