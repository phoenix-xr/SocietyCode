// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads variables from a .env file


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const seniorSchema = new mongoose.Schema({
    username: String,
    password: String,
    Asigned_to: String,
})

const Seniors = mongoose.model("Seniors", seniorSchema,"Seniors")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allows React (port 5173) to talk to Express (port 5000)
app.use(express.json()); // Parses incoming JSON data




app.post("/api/check_key", async (req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  const result = await Seniors.findOne({username:username});
  if (result && result.password==password){
    res.json({
      success: true,
      message: "GATES ARE UNLOCKED!!!",
      data: result
    })
  }
  else{
    res.json({
      success: false,
      message: "Invalid credentials",
    })
  }

})















app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});