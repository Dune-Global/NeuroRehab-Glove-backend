require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const indexRoute = require("./routes/index"); // Changed this line
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
const morgan = require("morgan");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(morgan("dev"));

app.use("/", indexRoute); // This line remains the same

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server is running on: " + PORT));