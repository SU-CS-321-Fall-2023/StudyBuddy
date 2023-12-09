const httpStatus = require('http-status')
const { chartService } = require('../services')
const catchAsync = require('../utils/catchAsync')

const sendMessage = catchAsync(async (req, res) => {
    const message = await chartService.createMessage(
        req.param.groupId,
        req.body.message)
    res.send(message)
})

const getGroupMessages = catchAsync(async (req, res) => {
    const messages = await chartService.getGroupCharts(req.param.groupId)
    res.send(messages)
})

module.exports = { sendMessage, getGroupMessages }