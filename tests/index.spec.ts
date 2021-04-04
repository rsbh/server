import supertest from 'supertest';
import Joi from 'joi';
import Server from '../src/server';

it('should get response from server', async (done) => {
  const server = new Server();
  const request = supertest(server.app);
  server.router.use({
    path: '/',
    method: 'GET',
    handler: async (req, res) => {
      res.send('Test');
    },
  });
  const response = await request.get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Test');
  done();
});

it('should get 404 error response from server', async (done) => {
  const server = new Server();
  const request = supertest(server.app);
  server.router.use({
    path: '/',
    method: 'GET',
    handler: async (req, res) => {
      res.send('Test');
    },
  });
  const response = await request.get('/test');
  expect(response.status).toBe(404);
  expect(response.body.message).toBe('Route GET:/test not found');
  done();
});

it('should get 400 error if query validation fail', async (done) => {
  const server = new Server();
  const request = supertest(server.app);
  server.router.use({
    path: '/',
    method: 'GET',
    validate: {
      query: Joi.object({
        foo: Joi.string().required(),
      }),
    },
    handler: async (req, res) => {
      res.send('Test');
    },
  });
  const response = await request.get('/');
  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Bad Request');
  done();
});

it('should get not give 400 error if query validation pass', async (done) => {
  const server = new Server();
  const request = supertest(server.app);
  server.router.use({
    path: '/',
    method: 'GET',
    validate: {
      query: Joi.object({
        foo: Joi.string().required(),
      }),
    },
    handler: async (req, res) => {
      res.send('Test');
    },
  });
  const response = await request.get('/?foo=bar');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Test');
  done();
});
