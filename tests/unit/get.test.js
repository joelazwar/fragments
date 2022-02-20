// tests/unit/get.test.js

const request = require('supertest');
const { Fragment } = require('../../src/model/fragment');

const app = require('../../src/app');
const hash = require('../../src/utils/hash');
//const {Fragment} = require('../../src/model/fragment')

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });
});
describe('GET /v1/fragments/:id', () => {
  test('Invalid id param results in error', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalid')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('Create a text fragment, then fetch the route to view raw data', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const res = await request(app).get('/v1/fragments/1234').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('a');
  });
});
