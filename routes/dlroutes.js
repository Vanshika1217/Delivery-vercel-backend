const express = require('express');
const router = express.Router();
const partnerController = require('../Controllers/DeliveryPartnerController'); // Ensure correct path
const { auth } = require('../Middlewares/auth'); // Ensure correct path
const Partner= require("../Models/DeliveryPartner")

// Correct route definition
router.get('/me',  async (req, res) => {
    const { id } = req.params;
//   const partnerId = req.user.name;
console.log(id);
  try {
    const partner = await Partner.findById(id).select('-password');
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }
    res.json(partner);
  } catch (err) {
    console.error('Error fetching partner details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
