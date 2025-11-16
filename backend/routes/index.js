// api/routes/index.js
import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import serviceController from "../controllers/ServiceController.js";
import eventController from "../controllers/EventController.js";
import multer from "multer";
import mime from "mime-types";
import { uploadToS3 } from "../utils/uploadToS3.js";
import imageDownload from "image-downloader";
import { Service } from "../models/Service.js";

router.use('/user', userController);
router.use('/service', serviceController);
router.use('/event', eventController);

const photosMiddleware = multer({ dest: '/tmp' });

// list services (index) with pagination/search
router.get('/services', async (req, res) => {
  try {
    const { page = 1, limit = 8, query } = req.query;
    let filter = {};
    if (query) {
      const regex = new RegExp(query, "i");
      filter = { $or: [{ title: regex }, { description: regex }] };
    }
    const services = await Service.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// upload images
router.post('/upload', photosMiddleware.array('photos', 50), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

router.post('/upload_by_link', async (req, res) => {
  try {
    const { imgLink } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownload.image({ url: imgLink, dest: '/tmp/' + newName });
    const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup('/tmp/' + newName));
    res.json(url);
  } catch (err) { res.json(err); }
});

export default router;