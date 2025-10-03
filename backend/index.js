const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");

const app = express();
const PORT = 4000;
dotEnv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDB connected successfully"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
