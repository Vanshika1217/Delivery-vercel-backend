const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

// POST: Add a new user
router.post('/add', async (req, res) => {
    try {
        // Check if the user already exists by email
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user object
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: secPass
        };

        // Save the user in the database
        user = await User.create(newUser);
        res.status(201).json(user);
        console.log("User saved");
    } catch (error) {
        // Catch and return error
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// DELETE: Remove a user
router.delete('/remove', async (req, res) => {
    try {
        // Find the user by email
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "Sorry, a user with this email does not exist" });
        }

        // Delete the user by ID
        const id = user._id;
        const response = await User.deleteOne({ _id: id });
        res.json({ message: "Successfully deleted", result: response });
    } catch (error) {
        // Catch and return error
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// GET: Fetch all users
router.get('/all', async (req, res) => {
    try {
        console.log("hi");
        // Fetch all users from the database
        const users = await User.find();
        console.log(users);
        // Check if t   here are no users
        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        // Send the list of users
        res.status(200).json(users);
    } catch (error) {
        // Catch and return error
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


module.exports = router;
