const Goods = require('../Models/WareHouseGoods');

// Add Goods
exports.addGoods = async (req, res) => {
    const { name, quantity, price } = req.body;
    try {
        const newGoods = new Goods({ name, quantity, price });
        await newGoods.save();
        res.status(201).json({ message: "Goods added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Goods Quantity
exports.updateGoods = async (req, res) => {
    const { id, quantity } = req.body;
    try {
        const updatedGoods = await Goods.findByIdAndUpdate(id, { quantity }, { new: true });
        if (!updatedGoods) return res.status(404).json({ error: "Goods not found" });
        res.json(updatedGoods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch All Goods
exports.fetchGoods = async (req, res) => {
    try {
        const goods = await Goods.find();
        res.json(goods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
