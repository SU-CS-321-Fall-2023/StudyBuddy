const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get inactive users
 * @returns {Promise<User>}
 */
const checkInactiveUsers = async () => {
  const inactiveUsers = await User.find({
    'activity.lastLogin': {
      $lte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  });

  return inactiveUsers;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const newOptions = { ...options, populate: 'classes'}
  const users = await User.paginate(filter, newOptions);
  return users;
  
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id)
  .populate('classes')
  .populate('studyGroups')
  .populate('friends')
  .populate('friendRequests');
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email })
  .populate('classes')
  .populate('studyGroups')
  .populate('friends')
  .populate('friendRequests');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = (await getUserById(userId));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  // Retrieve the user again to populate the fields
  const updatedUser = await User.findById(userId)
  .populate('classes')
  .populate('studyGroups')
  .populate('friends')
  .populate('friendRequests');

  return updatedUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const sendFriendRequest = async (senderId, recipientId) => {
  // Fetch sender and recipient user data
  const senderUser = await User.findById(senderId);
  const recipientUser = await User.findById(recipientId);

  // Validate the existence of sender and recipient
  if (!senderUser || !recipientUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check for existing relationships
  if (
    senderUser.friendRequests.includes(recipientId) ||
  
    recipientUser.friendRequests.includes(senderId)
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Friend request already sent or received`);
  }

  if (
    senderUser.friends.includes(recipientId) ||
    recipientUser.friends.includes(senderId)
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${recipientUser.name} is already a friend`);
  }

  if (senderId.toString() === recipientId.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot send friend request to self');
  }

  // Add friend request
  recipientUser.friendRequests.push(senderId);

  await recipientUser.save();
};

const acceptFriendRequest = async (accepterId, requesterId) => {
  // Fetch accepter and requester user data
  const accepterUser = await User.findById(accepterId);
  const requesterUser = await User.findById(requesterId);

  // Validate the existence of accepter and requester
  if (!accepterUser || !requesterUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if there is a friend request from the requester
  if (!accepterUser.friendRequests.includes(requesterId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `No friend request from ${requesterUser.name}`);
  }

  // Add each user to the other's friend list
  accepterUser.friends.push(requesterId);
  requesterUser.friends.push(accepterId);

  // Remove friend request
  accepterUser.friendRequests = accepterUser.friendRequests.filter((id) => id.toString() !== requesterId.toString());

  // Save changes to both users' data
  await accepterUser.save();
  await requesterUser.save();

  // Return the updated accepter user data with additional populated fields
  return User.findById(accepterId)
    .populate('classes')
    .populate('studyGroups')
    .populate('friends')
    .populate('friendRequests');
};

const rejectFriendRequest = async (rejecterId, requesterId) => {

  // Fetch rejecter and requester user data
  const rejecterUser = await User.findById(rejecterId);
  const requesterUser = await User.findById(requesterId);

  // Validate the existence of rejecter and requester
  if (!rejecterUser || !requesterUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if there is a friend request from the requester
  if (!rejecterUser.friendRequests.includes(requesterId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `No friend request from ${requesterUser.name}`);
  }

  // Remove friend request
  rejecterUser.friendRequests = rejecterUser.friendRequests.filter((id) => id.toString() !== requesterId.toString());

  // Save changes to both users' data
  await rejecterUser.save();

  // Return the updated rejecter user data with additional populated fields
  return User.findById(rejecterId)
    .populate('classes')
    .populate('studyGroups')
    .populate('friends')
    .populate('friendRequests');

};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  checkInactiveUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
