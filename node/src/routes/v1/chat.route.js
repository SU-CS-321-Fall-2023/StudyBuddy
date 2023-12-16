const express = require('express');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.controller');

const router = express.Router();

router
    .route('/')
    .post(validate(chatValidation.createChat), chatController.createChat)
router
    .route('/mychats')
    .post(validate(chatValidation.getAllChat), chatController.getAllChat)
router
    .route('/:chatId')
    .post(chatController.getChat)
    
// router
//     .route('/chat')
//     .post(chatController.findSenderReceiverChat)
module.exports = router