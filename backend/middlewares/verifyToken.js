const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();
const secretKey = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "vendor not found" });
    }

    req.vendorId = vendor._id;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Invalid token" });
  }
};

module.exports = verifyToken;
