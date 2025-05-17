const Event = require('../models/Event');
const User = require('../models/user');
const path = require("path");
const fs = require("fs");
const {cloudinaryUploadImage, cloudinaryRemoveImage} = require("../utils/coudinary");
exports.getAllEvents = async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const events = await Event.find();

    const modifiedEvents = events.map(event => {
      const isUserBooked = event.users.includes(UserId);
      return {
        ...event.toObject(), 
        isBooked: isUserBooked
      };
    });
    res.json(modifiedEvents);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
}};
exports.getRelatedEvents = async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const EventCategory = req.params.EventCategory;
    const EventId = req.params.EventId

    const query = { category: EventCategory };
    
    if (EventId && EventId !== "undefined" && EventId !== "no") {
      query._id = { $ne: EventId }; 
    }
    const events = await Event.find(query);
    const modifiedEvents = events.map(event => {
    const isUserBooked = event.users.includes(UserId);
      return {
        ...event.toObject(), 
        isBooked: isUserBooked
      };
    });
    res.json(modifiedEvents);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
}};
exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
};
exports.getMultipleEventsByIds = async (req, res) => {
  try {
    console.log(req.body)
    const { ids } = req.body; 
    const events = await Event.find({ _id: { $in: ids } });
    if (events.length === 0) {
      return res.json([]);
    }
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.createEvent = async (req, res) => {
       if(!req.file){
          return res.status(400).json({message: "no image provided"})
       }
       
       const image_path = path.join(__dirname , `../images/${req.file.filename}`);
       const result = await cloudinaryUploadImage(image_path);  
       const event = await Event.create({
           name: req.body.name,
           discription:req.body.discription,
           category: req.body.category,
           date: req.body.date,
           price : req.body.price,
           venue : req.body.venue,
           image:{
              url: result.secure_url,
              publicid:result.public_id
           },        
       })
       res.status(201).json(event)
       fs.unlinkSync(image_path); 
};
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    let updatedImage = existingEvent.image;

    if (req.file) {
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
      
      const result = await cloudinaryUploadImage(imagePath);
      updatedImage = {
        url: result.secure_url,
        publicid: result.public_id,
      };

      fs.unlinkSync(imagePath);
    }

     const updatedData = {
      name: req.body.name ?? existingEvent.name,
      discription: req.body.discription ?? existingEvent.discription,
      category: req.body.category ?? existingEvent.category,
      date: req.body.date ?? existingEvent.date,
      venue: req.body.venue ?? existingEvent.venue,
      price: req.body.price ?? existingEvent.price,
      image: updatedImage,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.BookEventByUser = async (req, res) => {
 try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) {
      return res.status(400).json({ message: "Missing userId or eventId." });
    }
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    if (event.users.includes(userId)) {
      return res.status(400).json({ message: "User already booked this event." });
    }
    if (user.events.includes(eventId)) {
      return res.status(400).json({ message: "Event already booked" });
    }
    user.events.push(eventId);
    await user.save();
    event.users.push(userId);
    await event.save();

    res.status(200).json({ message: "User booked successfully.", event });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error during booking." });
  }
};
exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
};
