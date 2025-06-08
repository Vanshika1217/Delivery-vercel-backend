const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    username: String, //required:true
    email: String,
    password: String, // hashed
    role: { type: String, default: "admin" }
  });
  
  module.exports = mongoose.model("Admin", adminSchema);
  