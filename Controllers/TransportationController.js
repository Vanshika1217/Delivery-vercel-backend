const Transportation = require('../Models/TransportationLog');

// Dispatch Delivery
exports.dispatchDelivery = async (req, res) => {
    const { orderId, vehicleId, dispatchTime, status } = req.body;
    try {
        const newDispatch = new Transportation({ orderId, vehicleId, dispatchTime, status });
        await newDispatch.save();
        res.status(201).json({ message: "Delivery dispatched successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Dispatch Status
exports.updateDispatchStatus = async (req, res) => {
    const { dispatchId, status } = req.body;
    try {
        const updatedDispatch = await Transportation.findByIdAndUpdate(dispatchId, { status }, { new: true });
        if (!updatedDispatch) return res.status(404).json({ error: "Dispatch not found" });
        res.json(updatedDispatch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Dispatch Details
exports.fetchDispatches = async (req, res) => {
    try {
        const dispatches = await Transportation.find();
        res.json(dispatches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
