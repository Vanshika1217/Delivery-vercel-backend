const Admin = require('../Models/Admin');
const Order = require('../Models/Order');
const DeliveryPartner = require('../Models/DeliveryPartner');
const Goods = require('../Models/WareHouseGoods');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin registration
exports.register = async (req, res) => {
    
    try {
        const { username, email, password} = req.body;
       
        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ error: "Admin with this email already exists" });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        admin = new Admin({
            username,
            email,
            password: hashedPassword
        });
        console.log(admin);
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ message: "Admin registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

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
    }
};

// Dashboard Overview
exports.dashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalPartners = await DeliveryPartner.countDocuments();
        const totalGoods = await Goods.countDocuments();

        res.json({
            totalOrders,
            totalPartners,
            totalGoods
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
