import db from '../utils/database';

// this tutorial is pretty nice
// https://losikov.medium.com/part-4-node-js-express-typescript-unit-tests-with-jest-5204414bf6f0

const TIMEOUT = 10 * 10000; // 20 seconds

/* setting up database */
beforeAll(async (done) => {
  await db.open();
  done();
}, TIMEOUT);

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
