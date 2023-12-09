const Joi = require('joi');
const { objectId } = require('./custom.validation');

const sendMessage = {
    params: Joi.object().keys({
        groupId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            message: Joi.object()
        })
};

const getGroupMessages = {
    params: Joi.object().keys({
        groupId: Joi.required().custom(objectId),
    }),
}

module.exports = {
    sendMessage,
    getGroupMessages
}