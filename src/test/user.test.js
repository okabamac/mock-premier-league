import request from 'supertest';
import app from '../../app';

import User from '../models/users.model';
import TestDbHelper from '../../testDB';

const dbHelper = new TestDbHelper();
let adminToken;
let userToken;

/**
 * Insert set of sample products into the database
 */
async function createSampleUsers() {
  const user1 = await new User({
    first_name: 'Mac',
    last_name: 'Okaba',
    email: 'markokaba99@gmail.com',
    password: '$2a$10$17MpQeJWeiXDlMhae/UvkO8I04nB4XOX24FnH0qN9i3VO8r9WFHni',
    is_admin: true,
  }).save();
  const user2 = await new User({
    first_name: 'John',
    last_name: 'James',
    email: 'jj06@gmail.com',
    password: '$2a$10$17MpQeJWeiXDlMhae/UvkO8I04nB4XOX24FnH0qN9i3VO8r9WFHni',
    is_admin: false,
  }).save();
  return { user1, user2 };
}

beforeAll(async () => {
  await dbHelper.start();
  const { user1 } = await createSampleUsers();
  const response = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: user1.email,
      password: 'johnbaby',
    });
  adminToken = response.body.data.token; // save the token!
});

afterAll(async () => {
  await dbHelper.stop();
});

describe('All user /user', () => {
  describe('POST /regular user', () => {
    test('It responds with the newly created regular user', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          first_name: 'Nicole',
          last_name: 'Kidman',
          email: 'nicolekidman@gmail.com',
          password: 'tomcruise',
          confirm_password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('first_name');
      expect(response.body.data).toHaveProperty('last_name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('is_admin');
    });
    test('It signs in the regular user', async () => {
      const response = await request(app)
        .post('/api/v1/users/signin')
        .send({
          email: 'nicolekidman@gmail.com',
          password: 'tomcruise',
        });

      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('first_name');
      expect(response.body.data).toHaveProperty('last_name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('is_admin');
      expect(response.body.data).toHaveProperty('token');
    });
    test('It throws an error for unregistered or missing credentials', async () => {
      const response = await request(app)
        .post('/api/v1/users/signin')
        .send({
          email: 'nicoleman@gmail.com',
          password: 'tomcruise',
        });

      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid credentials');
    });
    test('It throws an error for unregistered or missing credentials', async () => {
      const response = await request(app)
        .post('/api/v1/users/signin')
        .send({
          email: 'nicolekidman@gmail.com',
          password: 'tomcruises23',
        });

      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid credentials');
    });

    test('It throws an error because of missing first name', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          last_name: 'Kidman',
          email: 'nicolekidman@gmail.com',
          password: 'tomcruise',
          confirm_password: 'tomcruise',

        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('first_name is required');
    });

    test('It throws an error because of missing last name', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          first_name: 'Nicole',
          email: 'nicolekidman@gmail.com',
          password: 'tomcruise',
          confirm_password: 'tomcruise',

        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('last_name is required');
    });

    test('It throws an error because of missing email', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          first_name: 'Nicole',
          last_name: 'Kidman',
          password: 'tomcruise',
          confirm_password: 'tomcruise',

        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('email is required');
    });
    test('It throws an error because of missing password', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          first_name: 'Nicole',
          last_name: 'Kidman',
          email: 'nicolekidman@gmail.com',
          confirm_password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Your password and confirm password do not match');
    });
    test('It throws an error because of missing confirm password', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          first_name: 'Nicole',
          last_name: 'Kidman',
          email: 'nicolekidman@gmail.com',
          password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Your password and confirm password do not match');
    });
    test('It throws an error because of short password', async () => {
      const response = await request(app)
        .post('/api/v1/users/regular/signup')
        .send({
          first_name: 'Nicole',
          last_name: 'Kidman',
          email: 'nicolekidman@gmail.com',
          password: 'tom',
          confirm_password: 'tom',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('password length must be at least 6 characters long');
    });
  });

  describe('POST /admin user', () => {
    test('It responds with the newly created admin user', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Brad',
          last_name: 'Pitt',
          email: 'bradjol@gmail.com',
          password: 'tomcruise',
          confirm_password: 'tomcruise',
          is_admin: true,
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('first_name');
      expect(response.body.data).toHaveProperty('last_name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('is_admin');
      expect(response.body.data).toHaveProperty('token');
    });

    test('It throws an error because of missing first name', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          last_name: 'Pitt',
          email: 'bradjol@gmail.com',
          password: 'tomcruise',
          confirm_password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('first_name is required');
    });

    test('It throws an error because of missing last name', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Brad',
          email: 'bradjol@gmail.com',
          password: 'tomcruise',
          confirm_password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('last_name is required');
    });

    test('It throws an error because of missing email', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Brad',
          last_name: 'Pitt',
          password: 'tomcruise',
          confirm_password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('email is required');
    });
    test('It throws an error because of missing password', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Brad',
          last_name: 'Pitt',
          email: 'bradjol@gmail.com',
          confirm_password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        'Your password and confirm password do not match',
      );
    });
    test('It throws an error because of missing confirm password', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Brad',
          last_name: 'Pitt',
          email: 'bradjol@gmail.com',
          password: 'tomcruise',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        'Your password and confirm password do not match',
      );
    });
    test('It throws an error because of missing short password', async () => {
      const response = await request(app)
        .post('/api/v1/users/admin/signup')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          first_name: 'Brad',
          last_name: 'Pitt',
          email: 'bradjol@gmail.com',
          password: 'tom',
          confirm_password: 'tom',
        });
      // Ensure the results returned is correct
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        'password length must be at least 6 characters long',
      );
    });
  });
});
