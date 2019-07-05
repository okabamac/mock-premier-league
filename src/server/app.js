import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoute from '../routes/user.route';
import teamRoute from '../routes/team.route';
import fixtureRoute from '../routes/fixture.route';

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
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: "Sorry, we couldn't find that!",
  });
});

export default app;
