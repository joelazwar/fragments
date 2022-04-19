// tests/unit/delete.test.js

const request = require('supertest');
const { Fragment } = require('../../src/model/fragment');

const app = require('../../src/app');
const hash = require('../../src/utils/hash');

describe('DELETE /v1/fragment/:id', () => {
  test('Delete Fragment', async () => {
    const fragment = new Fragment({
      id: '1234',
      ownerId: hash('user1@email.com'),
      type: 'text/plain',
    });

    await fragment.setData(Buffer.from('a'));

    await fragment.save();

    const res = await request(app)
      .delete(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');

    const res2 = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(404);
    expect(res2.body.status).toBe('error');
    expect(res2.body.error.message).toBe('Error: Fragment id not found');
  });

  test('Delete non existent Fragment', async () => {
    const res2 = await request(app).get(`/v1/fragments/0000`).auth('user1@email.com', 'password1');

    expect(res2.statusCode).toBe(404);
    expect(res2.body.status).toBe('error');
    expect(res2.body.error.message).toBe('Error: Fragment id not found');
  });
});
