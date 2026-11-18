const express = require('express');

// Import controller functions for handling note-related operations

const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

// Create an Express router and define routes for CRUD operations on notes, including searching, creating, updating, and deleting notes

const router = express.Router();


router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
