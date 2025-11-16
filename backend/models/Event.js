// api/models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  eventType: { type: String, enum: ['marriage','engagement','birthday','meeting','get_together','other'], default:'other' },
  eventDate: String,
  venueAddress: String,
  budget: Number,
  finalCost: Number,
  numberOfGuests: Number,
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  notes: String
});

export const Event = mongoose.model('Event', eventSchema);