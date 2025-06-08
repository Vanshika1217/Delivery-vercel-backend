const mongoose = require("mongoose");
const dispatchSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
    dispatchTime: Date,
    pickupTime: Date,
    dropTime: Date,
    vehicleUsed: String,
    routeTaken: [
      {
        timestamp: Date,
        location: {
          type: { type: String, default: "Point" },
          coordinates: [Number]
        }
      }
    ],
    deliveryStatus: {
      type: String,
      enum: ["pending", "in-transit", "completed"],
      default: "pending"
    }
  });
  
  dispatchSchema.index({ "routeTaken.location": "2dsphere" });
  
  module.exports = mongoose.model("Dispatch", dispatchSchema);
  