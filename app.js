import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoute from './src/routes/user.route';
import teamRoute from './src/routes/team.route';
import fixtureRoute from './src/routes/fixture.route';
import connectionManager from './db.manager';


const app = express();
const API_VERSION = '/api/v1';

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(`${API_VERSION}/users`, userRoute);
app.use(`${API_VERSION}/teams`, teamRoute);
app.use(`${API_VERSION}/fixtures`, fixtureRoute);

if (process.env.NODE_ENV === 'test') {
  connectionManager.stop();
} else {
  connectionManager.start();
}

app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    return res.status(400).json({
      status: 400,
      error: `Failed to decode param: ${req.url}`,
    });
  }
  return next();
});
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: "Sorry, we couldn't find that!",
  });
});

export default app;
