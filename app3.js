// hashing password
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const md5 = require("md5");

const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;
const dbURL = process.env.MONGO_URL; // mongodb connected

mongoose // mongodb connected
  .connect(dbURL)
  .then(() => {
    console.log("mongodb atlas is connected");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: md5(req.body.password),
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const md5 = md5(req.body.password);
    const user = await User.findOne({ email: email });
    if (user && user.password === password) {
      res.status(200).json({ status: "Valid User" });
    } else {
      res.status(400).json({ status: "Not Valid User" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// route not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// handling server error
app.use((err, req, res, next) => {
  res.status(500).json({ message: "something broken" });
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
