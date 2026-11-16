const mongoose = require('mongoose');

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
