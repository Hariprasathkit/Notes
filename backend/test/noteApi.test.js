const { before, after, beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Note = require('../models/Note');

let mongo;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Note.deleteMany({});
});

test('creates notes, lists newest first, and supports case-insensitive title/content search', async () => {
  const first = await request(app).post('/api/notes').send({ title: 'Planning', content: 'Launch a BLUE project' });
  assert.equal(first.status, 201);
  assert.ok(first.body._id);
  const second = await request(app).post('/api/notes').send({ title: 'blue sky', content: '' });
  assert.equal(second.status, 201);

  const all = await request(app).get('/api/notes');
  assert.equal(all.status, 200);
  assert.deepEqual(all.body.map((note) => note.title), ['blue sky', 'Planning']);

  const matches = await request(app).get('/api/notes?search=BLUE');
  assert.equal(matches.status, 200);
  assert.equal(matches.body.length, 2);
});

test('validates required title and field limits', async () => {
  for (const body of [{}, { title: '  ' }, { title: 'x'.repeat(101) }, { title: 'Valid', content: 'x'.repeat(2001) }]) {
    const response = await request(app).post('/api/notes').send(body);
    assert.equal(response.status, 400);
    assert.equal(typeof response.body.error, 'string');
  }
  const valid = await request(app).post('/api/notes').send({ title: 'x'.repeat(100), content: 'x'.repeat(2000) });
  assert.equal(valid.status, 201);
});

test('reads, updates, and deletes notes with appropriate missing and invalid ID responses', async () => {
  const created = await request(app).post('/api/notes').send({ title: 'Original', content: 'Body' });
  const id = created.body._id;

  assert.equal((await request(app).get(`/api/notes/${id}`)).status, 200);
  const updated = await request(app).put(`/api/notes/${id}`).send({ title: 'Changed' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.title, 'Changed');
  assert.equal(updated.body.content, 'Body');
  assert.ok(new Date(updated.body.updatedAt) >= new Date(created.body.updatedAt));

  assert.equal((await request(app).get('/api/notes/not-an-id')).status, 400);
  assert.equal((await request(app).put('/api/notes/not-an-id').send({ title: 'Changed' })).status, 400);
  assert.equal((await request(app).get(`/api/notes/${new mongoose.Types.ObjectId()}`)).status, 404);
  assert.equal((await request(app).delete(`/api/notes/${new mongoose.Types.ObjectId()}`)).status, 404);
  assert.equal((await request(app).delete(`/api/notes/${id}`)).status, 204);
  assert.equal((await request(app).get(`/api/notes/${id}`)).status, 404);
});

test('returns JSON errors for malformed JSON and unsupported fields', async () => {
  const malformed = await request(app).post('/api/notes').set('Content-Type', 'application/json').send('{"title":');
  assert.equal(malformed.status, 400);
  assert.equal(typeof malformed.body.error, 'string');

  const extra = await request(app).post('/api/notes').send({ title: 'Valid', extra: true });
  assert.equal(extra.status, 400);
  assert.equal(typeof extra.body.error, 'string');

  const oversized = await request(app)
    .post('/api/notes')
    .send({ title: 'Valid', content: 'x'.repeat(17000) });
  assert.equal(oversized.status, 413);
  assert.equal(typeof oversized.body.error, 'string');
});

test('data remains available after reconnecting to the same database', async () => {
  const saved = await Note.create({ title: 'Persistent note' });
  const uri = mongo.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);
  const loaded = await Note.findById(saved._id);
  assert.equal(loaded.title, 'Persistent note');
});
