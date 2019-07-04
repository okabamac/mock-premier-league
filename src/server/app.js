import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


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
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: "Sorry, we couldn't find that!",
  });
});

export default app;
