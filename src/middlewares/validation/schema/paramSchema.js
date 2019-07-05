import Joi from '@hapi/joi';

const id = Joi.string()
  .regex(/^\d+$/)
  .required();

const IDSchema = Joi.object({
  team_id: id.error(new Error('team_id must be an integer')),
});
const IDSchema2 = Joi.object({
  fixture_id: id.error(new Error('fixture_id must be an integer')),
});

export default {
  '/:team_id': IDSchema,
  '/:fixture_id': IDSchema2,
  '/edit/:team_id': IDSchema,
  '/edit/:fixture_id': IDSchema2,
};
