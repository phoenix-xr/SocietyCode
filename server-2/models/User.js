const mongoose = require('mongoose');

const credsSchema = new mongoose.Schema({
  user: { type: String, required: true },
  password: { type: String, required: true },
  qr_code: { type: String },
  Asigned_to: [{ name: String, phone: String }]
}, { collection: 'Farewell' });

module.exports = mongoose.model('Cred', credsSchema);
