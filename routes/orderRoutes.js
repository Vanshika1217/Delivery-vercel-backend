const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const {Auth}= require('../Middlewares/auth')
// Create a new order
router.post('/', async (req, res) => {
  try {
    const order = new Order({
      ...req.body
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders for a user
router.get('/user', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/pending', async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' })
    .populate("user", "username") // assuming User model has a `name` field
  .lean();
    res.status(200).json(pendingOrders);

  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all orders for a partner
router.get('/partner', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('deliveryPartner');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});
// Get order by ID
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const orders = await Order.find({ user: userId }); // ✅ Correct
// assuming you store userId in order
    if (!orders || orders.length === 0) {
      console.log("hi");
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    console.log(orders);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/me/pending', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const pendingOrders = await Order.find({ user: userId, status: 'pending', status:'accepted' });

    if (!pendingOrders || pendingOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.json(pendingOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assign order to partner
router.patch('/:id/status', async (req, res) => {
  try {
    const { partnerId } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryPartner = partnerId;
    order.status = 'picked_up';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order location
router.patch('/:id/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Accept an order
router.patch('/:orderId/accept', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If the order is already accepted by someone else
    if (order.status === 'accepted' && order.deliveryPartner?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Order already accepted by another delivery partner' });
    }

    // Assign the delivery partner and update status
    order.deliveryPartner = req.user.id;
    order.status = 'accepted';
    
    await order.save();
    res.json({ message: 'Order accepted successfully' });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/add', auth, async (req, res) => {
  const { items, totalAmount, specialInstructions} = req.body;

  // Ensure all required fields are provided
  if (!items || !totalAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Hardcoded pickup and dropoff locations (replace these with actual values)
  const pickupLocation = {
    type: "Point",
    coordinates: [28.6129, 77.2295]  // Example coordinates for pickup location
  };

  const dropoffLocation = {
    type: "Point",
    coordinates: [28.4946,  77.0880]  // Example coordinates for dropoff location
  };
  const pickupAddress="JIIT 128"
  const deliveryAddress="JIIT Noida"

  try {
    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      specialInstructions,
      pickupLocation,
      dropoffLocation,
      deliveryAddress
    });

    console.log(newOrder);
    await newOrder.save();
    console.log("Order saved successfully");
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error saving order:', err); // Log the error for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
//endpoint to fetch all
// Get all orders (admin or general access)


module.exports = router;
