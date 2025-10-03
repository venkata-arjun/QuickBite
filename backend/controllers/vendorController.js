const vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotEnv = require("dotenv");

dotEnv.config();
const secretKey = process.env.JWT_SECRET;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json("Email already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();

    res.status(201).json({ message: "vendor registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  const secretKey = process.env.JWT_SECRET;
  try {
    const existingVendor = await vendor.findOne({ email });
    if (
      !existingVendor ||
      !(await bcrypt.compare(password, existingVendor.password))
    ) {
      return res.status(401).json({ err: "Invalid username or password" });
    }

    const token = jwt.sign({ vendorId: existingVendor._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ success: "Login successful", token });
    console.log(email, "this is the token : ", token);

    console.log(email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal server error" });
  }
};

module.exports = {
  vendorRegister,
  vendorLogin,
};
