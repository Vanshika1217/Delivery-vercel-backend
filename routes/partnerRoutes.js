const express = require('express');
const router = express.Router();
const partnerController = require('../Controllers/DeliveryPartnerController');
const Partner = require('../Models/DeliveryPartner');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');
const {auth2}= require("../Middlewares/auth");
const bcrypt= require("bcrypt")
const jwt = require('jsonwebtoken');
// router.post('/add', partnerController.addDeliveryPartner );
// router.get('/all', partnerController.fetchDeliveryPartners);
// router.put('/location/:id', partnerController.updateLocation);
// router.delete('/remove/:id', partnerController.removePartner);

// Get vehicle details for the logged-in partner
router.get('/vehicle', auth, async (req, res) => {
  try {
    const partner = await Partner.findById(req.user.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({
      vehicleNumber: partner.vehicleNumber,
      status: partner.status
    });
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update vehicle status
router.put('/vehicle/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const partner = await Partner.findById(req.user.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    partner.status = status;
    await partner.save();
    res.json({ message: 'Vehicle status updated successfully' });
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assigned orders for the partner
router.get('/orders/assigned', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user.id,
      status: { $in: ['assigned', 'accepted', 'picked_up'] }
    }).populate('user', 'name phone');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept an order
router.post('/orders/:orderId/accept', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this order' });
    }
    order.status = 'accepted';
    await order.save();
    res.json({ message: 'Order accepted successfully' });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline an order
router.post('/orders/:orderId/decline', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to decline this order' });
    }
    order.status = 'declined';
    order.deliveryPartner = null;
    await order.save();
    res.json({ message: 'Order declined successfully' });
  } catch (error) {
    console.error('Error declining order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (picked up, in transit, delivered)
router.put('/orders/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update partner's current location
router.put('/location', auth, authorize('partner'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const partner = await Partner.findById(req.user.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    partner.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    await partner.save();
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a new partner
// Partner Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, vehicleType } = req.body;

    // Log the incoming data
    console.log("Request body:", req.body);

    // Check if partner already exists by email
    console.log("Checking if partner exists with email:", email);
    let partner = await Partner.findOne({ email });
    
    // Log the result of the search
    console.log("Found partner:", partner);
    
    if (partner) {
      console.log("h1");
      return res.status(400).json({ error: "Partner with this email already exists" });
    }
   
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("h");

    // Create a new partner object
    partner = new Partner({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      vehicleType, // Store the vehicle type if provided
      currentLocation: {
        type: "Point", // MongoDB geospatial type
        coordinates: [24.5, 77.2], // Array of [longitude, latitude]
      },
    });

    console.log("Partner object created:", partner);  // Optional log to debug

    // Save the new partner to the database
    await partner.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: partner._id, role: 'partner' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with partner details (excluding password) and token
    res.status(201).json({
      partner: {
        id: partner._id,
        username: partner.username,
        email: partner.email,
        vehicleType: partner.vehicleType,
      },
      token,
    });
  } catch (error) {
    console.error("Error during partner registration:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
const verifyToken = require('../Middlewares/auth');
router.get('/me', verifyToken, async (req, res) => { try {
  console.log("Fetching profile for user:", req.user?.id); // Use optional chaining
  const partner = await Partner.findById(req.user.id).select('-password');
  if (!partner) {
    return res.status(404).json({ message: 'Delivery partner not found' });
  }
  res.json(partner);
} catch (err) {
  console.error('Error fetching partner details:', err);
  res.status(500).json({ message: 'Server error' });
} });



// Login partner
router.post('/login', async (req, res) => {
  try {
          const { email, password } = req.body;
          const admin = await Partner.findOne({ email });
  
          if (!admin) {
              return res.status(400).json({ error: "Admin not found" });
          }
  
          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
              return res.status(400).json({ error: "Invalid credentials" });
          }
  
          const token = jwt.sign(
              { id: admin._id, role: 'admin' },
              process.env.JWT_SECRET,
              { expiresIn: '1d' }
          );
  
          res.json({ message: "Login successful", token });
      } catch (error) {
          res.status(500).json({ message: "Internal server error", error: error.message });
      }}
    );


// Get partner profile
router.get('/profile', auth, authorize('partner'), async (req, res) => {
  res.json(req.user);
});

// Update partner profile
router.patch('/profile', auth, authorize('partner'), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'phone', 'vehicleNumber', 'vehicleType', 'status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update partner status
router.patch('/status', auth, authorize('partner'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    req.user.status = status;
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout partner
router.post('/logout', auth, authorize('partner'), async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get delivery partner details using the partner's ID from the JWT token
// router.get('/me', auth, async (req, res) => {
//   console.log("hello1");
//   try {
//     // The partner ID is already available from the authenticated user's token (req.user.id)
//     const partnerId = req.user.id;
//     console.log(partnerId);
//     console.log("hello1");
//     const partner = await Partner.findById(partnerId).select('-password'); // Exclude password
//     if (!partner) {
//       return res.status(404).json({ message: 'Delivery partner not found' });
//     }

//     res.json(partner);
//   } catch (error) {
//     console.error('Error fetching partner details:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Logout all sessions
router.post('/logoutAll', auth, authorize('partner'), async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/all', async (req, res) => {
  try {
    // Fetch all partners from the database, excluding the password field
    const partners = await Partner.find().select('-password');
    if (!partners || partners.length === 0) {
      return res.status(404).json({ message: 'No partners found' });
    }
    res.json(partners);
  } catch (error) {
    console.error('Error fetching all partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
