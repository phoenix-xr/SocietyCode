const mongoose = require('mongoose');

const credsSchema = new mongoose.Schema({
  user: { type: String, required: true },
  password: { type: String, required: true },
  Asigned_to: [{ name: String, phone: String }],
  invitation_img: Buffer,
  profile_img:Buffer,
  recieved_messages: [{ id:{type:String,required:true},name: String, message: String, guess_left: Number }],
  sent_to: [{ type: String }],
  level_complete:{type:Boolean}
}, { collection: 'Farewell' });

module.exports = mongoose.model('Cred', credsSchema);
