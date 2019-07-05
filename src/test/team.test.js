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

describe('All team management', () => {
  describe('POST /add team', () => {
    test('It responds with the newly added team', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('team_id');
      expect(response.body.data).toHaveProperty('team_name');
      expect(response.body.data).toHaveProperty('motto');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data).toHaveProperty('major_trophies');
      expect(response.body.data).toHaveProperty('year_founded');
      expect(response.body.data).toHaveProperty('current_manager');
    });

    test('It throws an error because of duplicate team name', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Team name is already registered');
    });

    test('It throws an error because of missing team name', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('team_name is required');
    });

    test('It throws an error because of missing motto', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('motto is required');
    });

    test('It throws an error because of missing major trophies', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('major_trophies is required');
    });

    test('It throws an error because of missing location', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('location is required');
    });
    test('It throws an error because of missing year founded', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('year_founded is required');
    });
    test('It throws an error because of missing current manager', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('current_manager is required');
    });

    test('It throws a 401 because of admin privileges', async () => {
      const response = await request(app)
        .post('/api/v1/teams/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authorized for only admins');
    });
  });


  describe('Delete team', () => {
    test('It responds with the deleted team', async () => {
      const response = await request(app)
        .delete('/api/v1/teams/1')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Team successfully deleted');
      expect(response.body.data).toHaveProperty('team_id');
      expect(response.body.data).toHaveProperty('team_name');
      expect(response.body.data).toHaveProperty('motto');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data).toHaveProperty('major_trophies');
      expect(response.body.data).toHaveProperty('year_founded');
      expect(response.body.data).toHaveProperty('current_manager');
    });

    test('It throws a 404', async () => {
      const response = await request(app)
        .delete('/api/v1/teams/1')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('This team does not exist');
    });
    test('It throws error because of bad ID', async () => {
      const response = await request(app)
        .delete('/api/v1/teams/jesus')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('team_id must be an integer');
    });
    test('It throws error because of admin privileges', async () => {
      const response = await request(app)
        .delete('/api/v1/teams/1')
        .set('Authorization', `Bearer ${userToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authorized for only admins');
    });
  });


  describe('Get team', () => {
    test('It responds with all the teams', async () => {
      const response = await request(app)
        .get('/api/v1/teams');
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('object');
    });
    test('It responds with a particular team', async () => {
      const response = await request(app)
        .get('/api/v1/teams/2')
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(typeof response.body.data).toBe('object');
    });
    test('It throws error because of invalid id', async () => {
      const response = await request(app)
        .get('/api/v1/teams/jesus')
        .set('Authorization', `Bearer ${adminToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('team_id must be an integer');
    });
    test('It throws error because of invalid id', async () => {
      const response = await request(app)
        .get('/api/v1/teams/jesus')
        .set('Authorization', `Bearer ${userToken}`);
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('team_id must be an integer');
    });
  });

  describe('Edit team', () => {
    test('It responds with the edited team', async () => {
      const response = await request(app)
        .put('/api/v1/teams/edit/3')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Team successfully edited');
      expect(response.body.data).toHaveProperty('team_id');
      expect(response.body.data).toHaveProperty('team_name');
      expect(response.body.data).toHaveProperty('motto');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data).toHaveProperty('major_trophies');
      expect(response.body.data).toHaveProperty('year_founded');
      expect(response.body.data).toHaveProperty('current_manager');
    });
    test('It throws error because of admin privileges', async () => {
      const response = await request(app)
        .put('/api/v1/teams/edit/3')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authorized for only admins');
    });
    test('It throws error because of team not found', async () => {
      const response = await request(app)
        .put('/api/v1/teams/edit/350000666666')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          team_name: 'Wigan Athletic',
          motto: 'Toffee Blues',
          major_trophies: '12',
          location: 'Wigan',
          year_founded: '1826',
          current_manager: 'Roberto Martinez',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('This team does not exist');
    });
  });
});
