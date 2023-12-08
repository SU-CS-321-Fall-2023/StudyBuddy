const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudyGroup = {
    body: Joi.object()
      .keys({
        name: Joi.string()
      })
  };

const joinStudyGroup = {
    params: Joi.object().keys({
        studygroupId: Joi.required().custom(objectId),
      })
}

module.exports = {
    createStudyGroup,
    joinStudyGroup
}