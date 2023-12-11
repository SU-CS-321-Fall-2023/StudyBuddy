const httpStatus = require('http-status');
const { PrivateMessage } = require('../models')
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');


/**
 * Get messages
 * @param {ObjectId} userId
 * @returns {Promise<Chat>}
 * 
 **/
const getAllPrivateChat = async (userId) => {
    const Chat = await PrivateMessage.find({$or: [
        { senderId: userId},
        { receiverId: userId}
      ]})
      .populate('senderId')
      .populate('receiverId')
      
    return Chat;
}
/**
 * Get messages
 * @param {ObjectId} messageId
 * @returns {Promise<Chat>}
 * 
 **/

const getPrivateChat = async(chatId) => {
    const Chat = await PrivateMessage.findById(chatId)
    return Chat;
    
}

/**
 * Get messages
 * @param {ObjectId} receiverId
 * *@param {ObjectId} senderId
 * @returns {Promise<Chat>}
 * 
 **/

const createChat = async(chat) => {
    const Chat = await PrivateMessage.create(chat)
    return Chat;
}

const findSenderReceiverChat= async(receiverId, senderId) => {
    const Chat = await PrivateMessage.findOne({  $and: [
        {
          $or: [
            { senderId: senderId },
            { receiverId: senderId }
          ]
        },
        {
          $or: [
            { senderId: receiverId },
            { receiverId: receiverId }
          ]
        }
      ]})
    return Chat;
}

module.exports = {
    getAllPrivateChat,
    getPrivateChat,
    createChat,
    findSenderReceiverChat
}