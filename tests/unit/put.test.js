// tests/unit/put.test.js

const request = require('supertest');
const { Fragment } = require('../../src/model/fragment');

const app = require('../../src/app');
const hash = require('../../src/utils/hash');

describe('PUT /v1/fragments', () => {
  test('Update a plain text fragment, receive back metadata response and ensure value is changed', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const res = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .send('b')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.fragment === 'object').toBe(true);
    expect((await fragment.getData()).toString()).toBe('b');
  });

  test('Try and update fragment with different type', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const res = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .send('# This is a header')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown');

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe("A fragment's type can not be changed after it is created");
  });

  test('Create a plain text fragment and receive metadata response', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const res = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .send('b')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.fragment === 'object').toBe(true);
  });

  test('Update non-existent id', async () => {
    const res = await request(app)
      .put(`/v1/fragments/0000`)
      .send('a')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('Error: Fragment id not found');
  });
});
