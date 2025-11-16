// api/controllers/serviceController.js
import express from "express";
const router = express.Router();
import { Service } from "../models/Service.js";
import { isLoggedIn } from "../middlewares/userAuth.js";

// Create a service (vendor only)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'vendor') return res.status(403).json("Only vendors can create services");
    const vendorId = req.user.id;
    const { title, category, photos, description, perks, price, priceType, availability } = req.body;
    const newService = await Service.create({
      vendor: vendorId, title, category, photos, description, perks, price, priceType, availability
    });
    res.status(201).json(newService);
  } catch (e) { res.status(500).json(e.message); }
});

// Update service
router.put('/', isLoggedIn, async (req, res) => {
  try {
    const { id, title, category, photos, description, perks, price, priceType, availability } = req.body;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json("Service not found");
    if (service.vendor.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json("Not allowed");
    service.set({ title, category, photos, description, perks, price, priceType, availability });
    await service.save();
    res.status(200).json(service);
  } catch (e) { res.status(500).json(e.message); }
});

// Delete service
router.delete('/', isLoggedIn, async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json("Service not found");
    if (service.vendor.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json("Not allowed");
    await Service.findByIdAndDelete(serviceId);
    res.status(200).json("Service deleted");
  } catch (e) { res.status(500).json(e.message); }
});

// Get service by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate('vendor', 'name email phone city');
    res.status(200).json(service);
  } catch (e) { res.status(500).json(e.message); }
});

// Get services for vendor account
router.get('/account', isLoggedIn, async (req, res) => {
  try {
    const vendorId = req.user.id;
    const myServices = await Service.find({ vendor: vendorId });
    res.status(200).json(myServices);
  } catch (e) { res.status(500).json(e.message); }
});

// Search & list with pagination / filter
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 8, q, category, city, minPrice, maxPrice } = req.query;
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    // basic city filter uses vendor populate later if needed
    const services = await Service.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('vendor', 'name city rating');
    res.json(services);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;