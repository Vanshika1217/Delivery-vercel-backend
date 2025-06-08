const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: { 
    type: String, 
    unique: true 
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {  // Updated to store coordinates as an array
      type: [Number], // Array of numbers [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["available", "on-delivery", "inactive"],
    default: "available"
  },
  assignedOrder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order" 
  },
  vehicleType: {
    type: String,
  }
  // vehicleDetails: {
  //   type: new mongoose.Schema({
  //     type: String,
  //     model: String,
  //     licensePlate: String
  //   }, { _id: false })
  // }
});

deliveryPartnerSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
