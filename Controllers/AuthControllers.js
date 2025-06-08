const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Add JWT
const User = require("../Models/User");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log("Signup request received:", { username, email });

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User created successfully:", username);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },  
      process.env.JWT_SECRET,                  
      { expiresIn: "1h" }                       
    );
    console.log(user)
    res.status(200).json({
      message: "Login successful",
      token: token, 
      username:user.username,
      email:user.email,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
};