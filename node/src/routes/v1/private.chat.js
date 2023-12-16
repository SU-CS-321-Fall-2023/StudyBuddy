const express = require('express');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.controller');

const router = express.Router();

router
    .route('/senderreceiverchat')
    .post(chatController.findSenderReceiverChat)
    
module.exports = router