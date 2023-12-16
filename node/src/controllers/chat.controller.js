const httpStatus = require('http-status')
const { chatService } = require('../services')
const catchAsync = require('../utils/catchAsync')

const getAllChat = catchAsync(async (req, res) => {
    console.log(req.body.user)
    const chats = await chatService.getAllPrivateChat(req.body.user.id)
    res.send(chats)
})

const getChat = catchAsync(async (req, res) => {
    const chat = await chatService.getPrivateChat(req.params.chatId)
    res.send(chat)
})

const createChat = catchAsync(async(req, res) => {
    const chat = await chatService.createChat(req.body.chat)
    return chat;
})

const findSenderReceiverChat = catchAsync(async(req, res) => {
    const chat = await chatService.findSenderReceiverChat(
        req.body.senderId, req.body.receiverId)

    res.status(httpStatus.OK).send(chat)
})

module.exports = { 
    getAllChat,
    getChat,
    createChat,
    findSenderReceiverChat,
}