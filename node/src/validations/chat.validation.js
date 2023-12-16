const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getAllChat = {
    body: Joi.object().keys({
            user: Joi.object()
        })
};

const getChat = {
    params: Joi.object().keys({
        chatId: Joi.required().custom(objectId),
    }),
}

const createChat ={
    body: Joi.object().keys({
        chat: Joi.object(),
    }),
}

module.exports = {
    getAllChat,
    getChat,
    createChat
}