const DeliveryPartner = require('../Models/DeliveryPartner');

// Add Delivery Partner
exports.addDeliveryPartner = async (req, res) => {
    const { name, vehicle, currentLocation } = req.body;
    try {
        const newPartner = new DeliveryPartner({ name, vehicle, location: currentLocation });
        await newPartner.save();
        res.status(201).json({ message: "Delivery partner added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Delivery Partner's Location
exports.updateLocation = async (req, res) => {
    const { partnerId, latitude, longitude } = req.body;
    try {
        const partner = await DeliveryPartner.findById(partnerId);
        if (!partner) return res.status(404).json({ error: "Delivery partner not found" });

        partner.location = { latitude, longitude };
        await partner.save();

        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Delivery Partner Details
exports.fetchDeliveryPartners = async (req, res) => {
    try {
        const partners = await DeliveryPartner.find();
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getPartnerProfile = async (req, res) => {
    const partnerId = req.user.id;
  
    try {
      const partner = await Partner.findById(partnerId).select('-password');
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }
  
      res.json(partner);
    } catch (error) {
      console.error('Error fetching partner profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
