const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Routes = require("./routes/index");

const url = "mongodb://localhost:27017/node-crud";

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

// routes
app.use("/v1/user", Routes);

// connect to tha Database
mongoose.connect(url).then(() => {
    console.log("MongoDB Database Connected Successfully!");
  })
  .catch((err) => {
    console.log("MongoDB Database Error! Please CheckOut");
  });

// connection to the Server

const PORT = 9000;

app.listen(PORT, () =>
  console.log(`Server is running Successfully on http://localhost:${PORT}`)
);
