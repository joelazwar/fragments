// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');
//const {Fragment} = require('../../src/model/fragment')

describe('POST /v1/fragments', () => {
  test('Create a plain text fragment and receive metadata response', async () => {
    const res = await request(app)
      .post(`/v1/fragments`)
      .send('a')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.fragment === 'object').toBe(true);
  });

  test('Create unsupported fragment and receive error', async () => {
    const res = await request(app)
      .post(`/v1/fragments`)
      .send('a')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    expect(res.statusCode).toBe(415);
    expect(res.body.error.message).toBe('Invalid type: Not Supported');
  });
});
