const mongoose = require('mongoose');
const Note = require('../models/Note');

// Validate if the provided ID is a valid MongoDB ObjectId

function validateId(id) {
  return mongoose.isValidObjectId(id);
}

// Validate the request body for creating or updating a note, ensuring required fields are present and valid

function validateBody(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'request body must be a JSON object';
  }

  const keys = Object.keys(body);
  if (keys.some((key) => !['title', 'content'].includes(key))) {
    return 'request body contains unsupported fields';
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return 'title is required';
    }
    if (body.title.trim().length > 100) {
      return 'title cannot exceed 100 characters';
    }
  } else if (keys.length === 0) {
    return 'request body must include title or content';
  }

  // Validate the content field if it is present in the request body

  if (Object.prototype.hasOwnProperty.call(body, 'content')) {
    if (typeof body.content !== 'string') {
      return 'content must be a string';
    }
    if (body.content.length > 2000) {
      return 'content cannot exceed 2000 characters';
    }
  }

  return null;
}

// Controller functions for handling CRUD operations on notes, including searching, creating, updating, and deleting notes


// Get all notes, optionally filtering by a search query that matches the title or content
async function getNotes(req, res, next) {
  try {
    const filter = {};
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const expression = new RegExp(escaped, 'i');
      filter.$or = [{ title: expression }, { content: expression }];
    }
    const notes = await Note.find(filter).sort({ createdAt: -1, _id: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
}

// Get a single note by ID, returning a 404 error if the note is not found or a 400 error for an invalid ID

async function getNote(req, res, next) {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ error: 'invalid note ID' });
    }
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'note not found' });
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
}

// Create a new note with the provided title and content, returning validation errors if the input is invalid

async function createNote(req, res, next) {
  try {
    const validationError = validateBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const note = await Note.create({
      title: req.body.title.trim(),
      content: req.body.content || '',
    });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

// Update an existing note by ID, allowing partial updates to the title and content fields, with validation

async function updateNote(req, res, next) {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ error: 'invalid note ID' });
    }
    const validationError = validateBody(req.body, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const updates = {};
    if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
      updates.title = req.body.title.trim();
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'content')) {
      updates.content = req.body.content;
    }
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ error: 'note not found' });
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
}

// Delete a note by ID, returning a 404 error if the note is not found or a 400 error for an invalid ID

async function deleteNote(req, res, next) {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ error: 'invalid note ID' });
    }
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'note not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { getNotes, getNote, createNote, updateNote, deleteNote };
