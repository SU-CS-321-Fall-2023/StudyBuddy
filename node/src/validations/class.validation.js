const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getClasses = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string()
  }),
};

module.exports = {
  getClasses
};
