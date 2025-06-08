const express = require("express"); // ✅ Import express
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation"); // ✅ Import validation middleware
const { signup, login } = require("../Controllers/AuthControllers"); // ✅ Import controller functions

const router = express.Router(); // ✅ Use express.Router()

router.post("/login", loginValidation, login);
router.post("/register", signupValidation, signup);

module.exports = router;
