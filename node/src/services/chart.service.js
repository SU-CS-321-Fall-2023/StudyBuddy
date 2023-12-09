const httpStatus = require('http-status');
const { StudyGroup } = require('../models')
const ApiError = require('../utils/ApiError');

/**
 * Add group message
 * @param {Object} message
 * @param {ObjectId} groupId
 * @returns {Promise<Message>}
 * 
 **/

const createMessage = async (groupId, message) => {
    if (message == null || message == undefined) {
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Message cannot be empty.');
        }
    }
    return await StudyGroup.findOneAndUpdate(
        groupId,
        { $push: { messages: message } },
        { new: true, useFindAndModify: false }
    )
}

/**
 * Get group messages
 * @param {ObjectId} groupId
 * @returns {Promise<Message>}
 * 
 **/
const getGroupCharts = async (groupId) => {
    const group = await StudyGroup.findById(groupId)
    if (!group) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group not found.');
    }
    return group;
}

module.exports = {
    createMessage,
    getGroupCharts
}