import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import lunchRouter from '../routes/lunch.api';
import userRouter from '../routes/user.api';

const createServer = (): express.Express => {
  const app = express();
  app.set('port', process.env.PORT || 5000);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  // API Routes
  app.use('/api/users', userRouter);
  app.use('/api/lunch', lunchRouter);

  return app;
};

export default createServer;
