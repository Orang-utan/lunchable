// loading initial seed data
import { hash } from 'bcrypt';
import { Error } from 'mongoose';
import { User } from './models/user.model';

/** initialize admin if there isn't one */
export const initializeAdmin = async () => {
  const firstName = 'Lunchable';
  const lastName = 'Admin';
  const email = 'admin@lunchable.com';
  const password = '12345678';
  const role = 'admin';
  const saltRounds = 10;

  if (await User.findOne({ email })) {
    return;
  }

  // hash + salt password
  return hash(password, saltRounds, async (err: Error, hashedPassword) => {
    if (err) {
      throw err;
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    console.log('✔️ Admin User Initialized');
  });
};
