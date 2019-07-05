import Joi from '@hapi/joi';

const id = Joi.string()
  .regex(/^\d+$/)
  .required();

const IDSchema = Joi.object({
  team_id: id.error(new Error('team_id must be an integer')),
});

export default {
  '/:team_id': IDSchema,
};
