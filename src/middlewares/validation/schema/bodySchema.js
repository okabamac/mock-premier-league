import Joi from '@hapi/joi';

const date = Joi.date().required();

const name = Joi.string()
  .regex(/^\D+$/)
  .required();

const email = Joi.string()
  .email()
  .lowercase()
  .required();

const password = Joi.string()
  .min(6)
  .required()
  .strict();

const id = Joi.string().regex(/^\d+$/).required();

const createUserSchema = Joi.object({
  first_name: name,
  last_name: name,
  email,
  password,
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .strict()
    .error(new Error('Your password and confirm password do not match')),
  is_admin: Joi.boolean().default(false, {
    invalid: true,
  }),
});
const signinUserSchema = Joi.object({
  email,
  password,
});
const createTripSchema = Joi.object({
  bus_id: id.error(new Error('bus_id is required')),
  origin: name.error(new Error('origin is required')),
  destination: name.error(new Error('destination is required')),
  trip_date: date.error(new Error('trip_date is required')),
  fare: Joi.number().positive().allow(0).precision(2)
    .required(),
});

export default {
  '/auth/signup': createUserSchema,
  '/auth/signin': signinUserSchema,
  '/create': createTripSchema,
};
