import supertest from 'supertest';
import { app } from '../server';
import db from '../utils/database';

// this tutorial is pretty nice
// https://losikov.medium.com/part-4-node-js-express-typescript-unit-tests-with-jest-5204414bf6f0

const TIMEOUT = 10 * 10000; // 20 seconds

/* setting up database */
beforeAll(async (done) => {
  await db.open();
  done();
}, TIMEOUT);

const user1 = {
  email: 'test1@gmail.com',
  password: '123456',
};

const user2 = {
  email: 'test2@gmail.com',
  password: '123456',
};

// utility function
async function getAccessToken(credentials: {
  email: string;
  password: string;
}): Promise<string> {
  const login = await supertest(app)
    .post('/api/users/login')
    .send(credentials)
    .expect(200);
  expect(login.body.accessToken).toBeTruthy();
  expect(login.body.refreshToken).toBeTruthy();
  return login.body.accessToken;
}

// creating two users
test('create two users user', async () => {
  const response1 = await supertest(app)
    .post('/api/users/signup')
    .send({
      firstName: 'Test',
      lastName: 'Tester 1',
      ...user1,
    })
    .expect(200);
  expect(response1.body.success).toBeTruthy();

  const response2 = await supertest(app)
    .post('/api/users/signup')
    .send({
      firstName: 'Test',
      lastName: 'Tester 2',
      ...user2,
    })
    .expect(200);
  expect(response2.body.success).toBeTruthy();
});

/** testing begins for lunch api */
test('find lunch', async () => {
  const accessToken = await getAccessToken(user1);
  const response = await supertest(app)
    .post('/api/lunches/find')
    .set({ Authorization: `Bearer ${accessToken}` })
    .expect(200);
  expect(response.body.message).toBeTruthy();
  expect(response.body.roomId).toBeTruthy();
});

/* kill database string after all tests */
afterAll(async (done) => {
  try {
    await db.close();
    done();
  } catch (error) {
    console.log(error);
    throw error;
  }
}, TIMEOUT);
