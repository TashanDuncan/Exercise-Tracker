const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Must provide a ID'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Must provide a username'],
    trim: true,
  },
  date: {
    type: Date,
  },
  duration: {
    type: Number,
    required: [true, 'Must provide a duration'],
  },
  description: {
    type: String,
    required: [true, 'Must provide a description'],
 
  },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
