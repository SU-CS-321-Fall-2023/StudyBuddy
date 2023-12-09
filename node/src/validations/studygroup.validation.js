const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudyGroup = {
  body: Joi.object().keys({
    userCreator: Joi.object(), // Allow any object for userCreator
    newGroupBody: Joi.object(), // Allow any object for newGroupBody
  }),
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