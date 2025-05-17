const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
   
  title: { type: String, ref: 'User' },
  description: { type: String, ref: 'Event' },
  image: {
      type: Object,
      default: {
        url: "",
        publicid: null
      }
    },
});

module.exports = mongoose.model('Category', CategorySchema);
