// api/controllers/userController.js
import express from "express";
const router = express.Router();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { isLoggedIn } from "../middlewares/userAuth.js";
import { generateRandomPassword } from "../utils/generatePassword.js";
import { configDotenv } from "dotenv";

configDotenv();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

// register (role optional)
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'client', phone, city } = req.body;
  try {
    const newUser = await User.create({
      name, email, password: bcrypt.hashSync(password, bcryptSalt), role, phone, city
    });
    res.status(201).json(newUser);
  } catch (e) { res.status(422).json(e); }
});

// login unchanged
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User Not Exist");
    const passOk = bcrypt.compareSync(password, user.password);
    if (!passOk) return res.status(422).json("Wrong Password");
    jwt.sign({ email: user.email, id: user._id, name: user.name, role: user.role }, jwtSecret, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: "none", secure: true }).json(user);
    });
  } catch (err) { res.status(500).json({ message: "Internal Server Error", error: err.message }); }
});

// logout unchanged
router.post('/logout', async (req, res) => {
  res.cookie('token', '').json(true);
});

// update user
router.put('/', isLoggedIn, async (req, res) => {
  try {
    const { newName, newPassword, phone, city } = req.body;
    const userId = req.user.id;
    const toSet = {};
    if (newName) toSet.name = newName;
    if (newPassword) toSet.password = bcrypt.hashSync(newPassword, bcryptSalt);
    if (phone) toSet.phone = phone;
    if (city) toSet.city = city;
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: toSet }, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) { res.status(500).json(err.message); }
});

// get current user
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) { res.status(500).json({ success:false, message:'Internal Server Error', error: err.message }); }
});

// profile
router.get('/profile', isLoggedIn, (req, res) => res.json(req.user));

// change bookings updates
router.put('/bookings', isLoggedIn, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const updatedBookings = [...(user.bookings || []), bookingId];
    await User.findByIdAndUpdate(userId, { $set: { bookings: updatedBookings } });
    res.status(200).json("User bookings updated");
  } catch (err) { res.status(500).json(err.message); }
});

// delete booking references
router.delete('/bookings', isLoggedIn, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const updated = (user.bookings || []).filter(id => id.toString() !== bookingId);
    await User.findByIdAndUpdate(userId, { $set: { bookings: updated }});
    res.status(200).json("User Bookings Updated Successfully");
  } catch (err) { res.status(500).json(err.message); }
});

// public details
router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ success:false, message:'Internal Server Error', error: err.message }); }
});

// google auth (unchanged)
router.post("/auth", async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });
    if (user == null) {
      const password = generateRandomPassword();
      user = await User.create({ name, email, password: bcrypt.hashSync(password, bcryptSalt) });
    }
    jwt.sign({ email: user.email, id: user._id, name: user.name, role: user.role }, jwtSecret, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: "none", secure: true }).json(user);
    });
  } catch (err) { res.status(500).json(err.message); }
});

export default router;