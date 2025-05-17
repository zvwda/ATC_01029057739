  const mongoose = require('mongoose');

  const eventSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    discription: {
      type: String,
    },
    category: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicid: null
      }
    },
    isBooked:{
      type: Boolean,
      default:false,
    },
    users: [{
      type: String,
    }]
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Event', eventSchema);
