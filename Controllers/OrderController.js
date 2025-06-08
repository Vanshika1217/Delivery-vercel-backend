const Order = require('../Models/Order');
const Product = require('../Models/Product'); // Assuming Product model exists
const mongoose = require('mongoose');

// Create New Order
exports.createOrder = async (req, res) => {
    const { userId, items, deliveryAddress, specialInstructions, pickupLocation, dropoffLocation, estimatedDeliveryTime } = req.body;
    
    // Calculate totalAmount
    let totalAmount = 0;
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        
        totalAmount += product.price * item.quantity;
    }

    try {
        const newOrder = new Order({
            user: userId,
            items,
            totalAmount,
            deliveryAddress,
            specialInstructions,
            pickupLocation,
            dropoffLocation,
            estimatedDeliveryTime
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Orders
exports.fetchOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.productId'); // Populate user and items with product details
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Orders with specific geospatial criteria (e.g., nearby orders)
exports.fetchOrdersByLocation = async (req, res) => {
    const { lat, lng, radius = 5 } = req.query; // radius in kilometers (default is 5)

    try {
        const orders = await Order.find({
            pickupLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            }
        }).populate('user').populate('items.productId');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
