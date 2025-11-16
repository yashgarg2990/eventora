// api/models/Service.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['decorator','caterer','musician','photographer','host','venue','other'], default: 'other' },
  description: String,
  photos: [String],
  price: Number, // base price or package price
  priceType: { type: String, enum: ['fixed','per_head','package'], default: 'fixed' },
  availability: [String], // dates in ISO or simple strings
  perks: [String],
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Service = mongoose.model('Service', serviceSchema);