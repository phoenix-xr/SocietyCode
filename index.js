require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Cred = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { dbName: 'Farewell' })
  .then(() => console.log("Connected to MongoDB (Database: Farewell)"))
  .catch(err => console.error("MongoDB connection error:", err));

// get_names(): returns list of full names of seniors
app.get('/api/get_names', async (req, res) => {
  try {
    // Assuming the "user" field stores the full names of seniors.
    const records = await Cred.find({}, { user: 1, _id: 0 });
    const names = records.map(record => record.user);
    res.json({ success: true, names });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// get_assigned(): accepts a "user" string and returns out "Asigned_to" list from mongo db
app.post('/api/get_assigned', async (req, res) => {
  try {
    const  {user}  = req.body;
    if (!user) {
      return res.status(400).json({ success: false, error: "user query parameter is required" });
    }
    const record = await Cred.findOne({ user:user }, { Asigned_to: 1, _id: 0 });
    if (!record) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, Assigned_to: record.Asigned_to });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// check_pass(): accepts a "user" and "password" and checks mongodb for that and returns success or not
app.post('/api/check_pass', async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user || !password) {
      return res.status(400).json({ success: false, error: "user and password are required in request body" });
    }
    const record = await Cred.findOne({ user, password });
    if (record) {
      res.json({ success: true, message: "Authentication successful" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// get_qr_code(): accepts "user", "password" and gives out "qr_code" field from mongo db
app.post('/api/get_qr_code', async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user || !password) {
      return res.status(400).json({ success: false, error: "user and password are required in request body" });
    }
    const record = await Cred.findOne({ user, password }, { qr_code: 1, _id: 0 });
    if (record) {
      res.json({ success: true, qr_code: record.qr_code });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
