const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "assigned", "accepted", "declined", "picked_up", "in_transit", "delivered", "cancelled"],
        default: "pending"
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
           
        }
    },
    pickupAddress:{
        type:String,
    },
    dropoffLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
           
        }
    },
    deliveryAddress: {
        type: String,
       
    },
    specialInstructions: {
        type: String
    },
    estimatedDeliveryTime: {
        type: Date
    },
    actualDeliveryTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// orderSchema.index({ pickupLocation: "2dsphere" });
// orderSchema.index({ dropoffLocation: "2dsphere" });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
