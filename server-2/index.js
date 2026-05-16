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

// get_names(): returns list of full names of seniors, excluding those already messaged by the sender
app.post('/api/get_names', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "username and password are required" });
    }

    // Authenticate sender and get their sent_to list
    const sender = await Cred.findOne({ user: username, password });
    if (!sender) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const alreadySent = new Set(sender.sent_to || []);

    // Get all names, filter out already-messaged users and the sender themselves
    const records = await Cred.find({}, { user: 1, _id: 0 });
    const names = records
      .map(r => r.user)
      .filter(name => name !== username && !alreadySent.has(name));

    res.json({ success: true, names });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// get_all_names(): returns every username in the collection, no auth required
app.get('/api/get_all_names', async (req, res) => {
  try {
    const records = await Cred.find({}, { user: 1, _id: 0 });
    const names = records.map(r => r.user);
    res.json({ success: true, names });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// get_assigned(): accepts a "user" string and returns out "Asigned_to" list from mongo db
// app.post('/api/get_assigned', async (req, res) => {
//   try {
//     const  {user}  = req.body;
//     if (!user) {
//       return res.status(400).json({ success: false, error: "user query parameter is required" });
//     }
//     const record = await Cred.findOne({ user:user }, { Asigned_to: 1, _id: 0 });
//     if (!record) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }
//     res.json({ success: true, Assigned_to: record.Asigned_to });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

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
// app.post('/api/get_qr_code', async (req, res) => {
//   try {
//     const { user, password } = req.body;
//     if (!user || !password) {
//       return res.status(400).json({ success: false, error: "user and password are required in request body" });
//     }
//     const record = await Cred.findOne({ user, password }, { qr_code: 1, _id: 0 });
//     if (record) {
//       res.json({ success: true, qr_code: record.qr_code });
//     } else {
//       res.status(401).json({ success: false, error: "Invalid credentials" });
//     }
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// 1. get_recieved_messages()
app.post('/api/get_recieved_messages', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "username and password required" });
    }
    const record = await Cred.findOne({ user: username, password });
    if (!record) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    if (!record.level_complete) {
      return res.status(403).json({ success: false, error: "Level not complete" });
    }
    
    const messages = record.recieved_messages.map(msg => ({
      id: msg.id,
      message: msg.message,
      guess_left: msg.guess_left
    }));
    
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. get_invitation()
app.post('/api/get_profile_img', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username ) {
      return res.status(400).json({ success: false, error: "username required" });
    }
    const record = await Cred.findOne({ user: username });
    if (!record) {
      return res.status(401).json({ success: false, error: "Invalid user" });
    }
    if (!record.profile_img) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }
    
    res.contentType('image/jpeg');
    res.send(record.profile_img);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. get_invitation()
app.post('/api/get_invitation', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "username and password required" });
    }
    const record = await Cred.findOne({ user: username, password });
    if (!record) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    if (!record.level_complete) {
      return res.status(403).json({ success: false, error: "Level not complete" });
    }
    if (!record.invitation_img) {
      return res.status(404).json({ success: false, error: "Invitation image not found" });
    }
    
    res.contentType('image/jpeg');
    res.send(record.invitation_img);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. level_status()
app.post('/api/level_status', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: "username required" });
    }
    const record = await Cred.findOne({ user: username });
    if (!record) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    res.json({ success: true, level_complete: !!record.level_complete });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post('/api/update_game_status', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: "username required" });
    }
    const record = await Cred.findOne({ user: username });
    if (!record) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    record.level_complete = true;
    await record.save();
    res.json({ success: true});
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. send_message()
app.post('/api/send_message', async (req, res) => {
  try {
    const { message, username, password, to_send_username } = req.body;
    if (!message || !username || !password || !to_send_username) {
      return res.status(400).json({ success: false, error: "message, username, password, to_send_username are required" });
    }
    
    const sender = await Cred.findOne({ user: username, password });
    if (!sender) {
      return res.status(401).json({ success: false, error: "Invalid credentials for sender" });
    }
    
    const recipient = await Cred.findOne({ user: to_send_username });
    if (!recipient) {
      return res.status(404).json({ success: false, error: "Recipient not found" });
    }
    
    const alreadySent = recipient.recieved_messages.some(msg => msg.name === username);
    if (alreadySent) {
      return res.status(400).json({ success: false, error: "Message from this sender already exists" });
    }
    
    const messageId = new mongoose.Types.ObjectId().toString();
    
    recipient.recieved_messages.push({
      id: messageId,
      name: username,
      message: message,
      guess_left: 3
    });
    
    await recipient.save();
    
    // Update sender's sent_to list
    if (!sender.sent_to) sender.sent_to = [];
    sender.sent_to.push(to_send_username);
    await sender.save();
    
    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. check_guess()
app.post('/api/check_guess', async (req, res) => {
  try {
    const { username, guess_name, message_id } = req.body;
    if (!username || !guess_name || !message_id) {
      return res.status(400).json({ success: false, error: "username, guess_name, and message_id are required" });
    }
    
    const userRecord = await Cred.findOne({ user: username });
    if (!userRecord) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    const messageIndex = userRecord.recieved_messages.findIndex(msg => msg.id === message_id);
    if (messageIndex === -1) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }
    
    const messageObj = userRecord.recieved_messages[messageIndex];
    
    if (messageObj.guess_left === 0) {
      return res.status(403).json({ success: false, error: "No guesses left" });
    }
    
    if (messageObj.name === guess_name) {
      return res.json({ success: true, matched: true });
    } else {
      userRecord.recieved_messages[messageIndex].guess_left -= 1;
      userRecord.markModified('recieved_messages');
      await userRecord.save();
      return res.json({ success: true, matched: false, guess_left: userRecord.recieved_messages[messageIndex].guess_left });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
