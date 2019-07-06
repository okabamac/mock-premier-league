import dotenv from 'dotenv';

dotenv.config();
const keys = {
  port: process.env.PORT,
  secret: process.env.SECRET,
  mongoUri: process.env.MONGO_URI,
};
export default keys;
