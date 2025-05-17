const express = require('express');
const path = require("path");
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const photoupload = require("../middlewares/photoUpload");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  BookEventByUser,
  getRelatedEvents,
  getMultipleEventsByIds
} = require('../controllers/eventController');

router.get('/relatedevents/:UserId/:EventCategory/:EventId', getRelatedEvents);
router.get('/:UserId', getAllEvents);
router.get('/GetSingle/:id', getEventById);
router.post('/GetMultipleEvent', getMultipleEventsByIds);
router.post('/', protect, adminOnly, photoupload.single("image"),  createEvent);
router.put('/:id', protect, adminOnly,  photoupload.single("image"),updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/BookEventByUser', BookEventByUser);

module.exports = router;
