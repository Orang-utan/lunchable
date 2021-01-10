import cors from 'cors';
import express from 'express';
import routes from './routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/api', routes);

// Serving Simple Static View
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_, res) => {
    res.send("👀 You've reached Lunchable's API server.");
  });
}
