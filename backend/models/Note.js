const mongoose = require('mongoose');

// Define the Note schema with title and content fields, including validation rules for required fields and maximum lengths

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      maxlength: [100, 'title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [2000, 'content cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
