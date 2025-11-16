// api/controllers/eventController.js
import express from "express";
const router = express.Router();
import { Event } from "../models/Event.js";
import { Service } from "../models/Service.js";
import { isLoggedIn } from "../middlewares/userAuth.js";

// create new event booking (client)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json("Only clients can create events");
    const clientId = req.user.id;
    const { services, eventType, eventDate, venueAddress, budget, numberOfGuests, notes } = req.body;
    // validate services exist
    const found = await Service.find({ _id: { $in: services }});
    if (found.length !== services.length) return res.status(400).json("One or more services invalid");
    const newEvent = await Event.create({
      client: clientId, services, eventType, eventDate, venueAddress, budget, numberOfGuests, notes
    });
    res.status(201).json(newEvent);
  } catch (err) { res.status(500).json(err.message); }
});

// client: get their events
router.get('/account', isLoggedIn, async (req, res) => {
  try {
    const clientId = req.user.id;
    const events = await Event.find({ client: clientId }).populate('services').populate('coordinator','name phone');
    res.status(200).json(events);
  } catch (err) { res.status(500).json(err.message); }
});

// get event detail by id (for client & vendor & coordinator)
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('services').populate('client','name email').populate('coordinator','name phone');
    res.status(200).json(event);
  } catch (err) { res.status(500).json(err.message); }
});

// admin/coordinator: update event status, assign coordinator, finalize cost
router.put('/', isLoggedIn, async (req, res) => {
  try {
    const { id, status, coordinatorId, finalCost } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json("Event not found");
    // Only admin or coordinator assignment allowed
    if (status) event.status = status;
    if (coordinatorId) event.coordinator = coordinatorId;
    if (finalCost) event.finalCost = finalCost;
    await event.save();
    res.status(200).json(event);
  } catch (err) { res.status(500).json(err.message); }
});

// delete event
router.delete('/', isLoggedIn, async (req, res) => {
  try {
    const { eventId } = req.body;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json("Event deleted");
  } catch (err) { res.status(500).json(err.message); }
});

export default router;