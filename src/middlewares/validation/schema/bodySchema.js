import Joi from '@hapi/joi';

// const date = Joi.date().required();

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

// const id = Joi.string()
//   .regex(/^\d+$/)
//   .required();

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
});

const createAdminSchema = Joi.object({
  first_name: name,
  last_name: name,
  email,
  password,
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .strict()
    .error(new Error('Your password and confirm password do not match')),
  is_admin: Joi.boolean().default(true, {
    invalid: true,
  }),
});
const userSigninSchema = Joi.object({
  email,
  password,
});


export default {
  '/admin/signup': createAdminSchema,
  '/regular/signup': createUserSchema,
  '/signin': userSigninSchema,
};
