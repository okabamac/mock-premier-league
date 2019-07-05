import request from 'supertest';

import app from '../server/app';

let adminToken;
let userToken;
// Imported our node application

beforeAll(async (done) => {
  const adminTokenResponse = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'markokaba99@gmail.com',
      password: 'johnbaby',
    });
  adminToken = adminTokenResponse.body.data.token; // save the token!
  const userTokenResponse = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'jj06@gmail.com',
      password: 'johnbaby',
    });
  userToken = userTokenResponse.body.data.token; // save the token!
  done();
});

describe('All fixture management', () => {
  describe('POST /add fixture', () => {
    test('It responds with the newly added fixture', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('fixture_id');
      expect(response.body.data).toHaveProperty('team_A');
      expect(response.body.data).toHaveProperty('team_B');
      expect(response.body.data).toHaveProperty('date');
      expect(response.body.data).toHaveProperty('time');
    });

    test('It throws an error because of duplicate fixture', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('There is already a scheduled fixture between the teams on that date');
    });

    test('It throws an error because of missing team name', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('team_A is required');
    });

    test('It throws an error because of missing team name', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('team_B is required');
    });

    test('It throws an error because of missing date', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('date is required');
    });

    test('It throws an error because of invalid date', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: 'string',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('date must be a number of milliseconds or valid date string');
    });

    test('It throws an error because of missing time', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('time is required');
    });
    test('It throws an error because of missing venue', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('venue is required');
    });
    test('It throws an error because of missing status', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('status is required');
    });
    test('It throws an error because of invalid status type', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'not yet',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('status must be one of [pending, completed]');
    });

    test('It throws a 401 because of admin privileges', async () => {
      const response = await request(app)
        .post('/api/v1/fixtures/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
          status: 'pending',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authorized for only admins');
    });
  });

  describe('Delete fixture', () => {
    test('It responds with the deleted fixture', async () => {
      const response = await request(app)
        .delete('/api/v1/fixtures/1')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Fixture successfully deleted');
      expect(response.body.data).toHaveProperty('fixture_id');
      expect(response.body.data).toHaveProperty('team_A');
      expect(response.body.data).toHaveProperty('team_B');
      expect(response.body.data).toHaveProperty('date');
      expect(response.body.data).toHaveProperty('time');
      expect(response.body.data).toHaveProperty('venue');
      expect(response.body.data).toHaveProperty('scores');
    });

    test('It throws error because fixture is deleted', async () => {
      const response = await request(app)
        .delete('/api/v1/fixtures/1')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('This fixture does not exist');
    });
    test('It throws error because of bad ID', async () => {
      const response = await request(app)
        .delete('/api/v1/fixtures/jesus')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('fixture_id must be an integer');
    });
    test('It throws error because of admin privileges', async () => {
      const response = await request(app)
        .delete('/api/v1/fixtures/1')
        .set('Authorization', `Bearer ${userToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authorized for only admins');
    });
  });

  describe('Get fixture', () => {
    test('It responds with all the fixtures', async () => {
      const response = await request(app).get('/api/v1/fixtures');
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('object');
    });
    test('It responds with all the pending fixtures', async () => {
      const response = await request(app).get('/api/v1/fixtures/?status=pending');
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('object');
    });
    test('It responds with all the completed fixtures', async () => {
      const response = await request(app).get('/api/v1/fixtures/?status=completed');
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('object');
    });
    test('It throws error because of bad status argument', async () => {
      const response = await request(app).get('/api/v1/fixtures/?status=completion');
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('No completion fixtures');
    });
    test('It responds with a particular fixture', async () => {
      const response = await request(app).get('/api/v1/fixtures/2');
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('object');
    });
    test('It throws error because of invalid id', async () => {
      const response = await request(app)
        .get('/api/v1/fixtures/jesus')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('fixture_id must be an integer');
    });
    test('It throws error because of invalid id', async () => {
      const response = await request(app)
        .get('/api/v1/fixtures/jesus')
        .set('Authorization', `Bearer ${userToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('fixture_id must be an integer');
    });
  });

  describe('Edit fixtures', () => {
    test('It responds with the edited fixtures', async () => {
      const response = await request(app)
        .put('/api/v1/fixtures/edit/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Fixture successfully edited');
      expect(response.body.data).toHaveProperty('fixture_id');
      expect(response.body.data).toHaveProperty('team_A');
      expect(response.body.data).toHaveProperty('team_B');
      expect(response.body.data).toHaveProperty('date');
      expect(response.body.data).toHaveProperty('time');
      expect(response.body.data).toHaveProperty('venue');
      expect(response.body.data).toHaveProperty('scores');
    });
    test('It throws error because of admin privileges', async () => {
      const response = await request(app)
        .put('/api/v1/teams/edit/3')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authorized for only admins');
    });
    test('It throws error because of fixture not found', async () => {
      const response = await request(app)
        .put('/api/v1/fixtures/edit/350000666666')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_A: 'Wigan Athletic',
          team_B: 'Birmingham Athletic',
          date: '12-06-2019',
          time: '4pm',
          venue: 'Wigan Park',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('This fixture does not exist');
    });
  });
});
