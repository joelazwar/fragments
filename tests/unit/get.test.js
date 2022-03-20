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

  test('View raw text fragment', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const res = await request(app).get('/v1/fragments/1234').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(res.text).toBe('a');
  });
  test('View json fragment', async () => {
    const json = { name: 'John Doe', age: 22 };
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'application/json',
    });

    await fragment.setData(json);

    await fragment.save();

    const res = await request(app).get('/v1/fragments/1234').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toStrictEqual(json);
  });
});
describe('GET /v1/fragments/:id/info', () => {
  test('View raw text fragment metadata', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const expected = {
      status: 'ok',
      fragment: {
        created: fragment.created,
        id: fragment.id,
        ownerId: fragment.ownerId,
        size: fragment.size,
        type: fragment.type,
        updated: fragment.updated,
      },
    };

    const res = await request(app)
      .get('/v1/fragments/1234/info')
      .auth('user1@email.com', 'password1');

    console.log(res);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toStrictEqual(expected);
  });
});
