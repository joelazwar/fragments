// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 test', () => {
  test('Non existent route returns 404 error with message', async () => {
    const res = await request(app).get('/abc123');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
    expect(res.body.error.code).toBe(404);
  });
});
