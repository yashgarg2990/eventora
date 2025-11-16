// api/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['client','vendor','coordinator','admin'], default: 'client' },
  phone: String,
  city: String,
  // for vendors: services they offer
  servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  // history fields for analytics
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);