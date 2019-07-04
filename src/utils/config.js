import dotenv from 'dotenv';

dotenv.config();
const keys = {
  port: process.env.PORT,
  secret: process.env.SECRET,
};
export default keys;
