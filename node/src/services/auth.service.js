const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  //get the current time of login
  //call login history function with logout time and session minutes as null
  //add a token to the user?
  const login_time = new Date();
  await addLoginHistory(user.email, login_time, null, null);
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
 //replace email with user schema instead, or change search to email here
//could put all this in a function
//where to put add LoginHistory function?
const logout = async (refreshToken) => {
  //get the token
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  //update total user interaction time and login history
  //get the user from the token schema (and search in the login schema for it)
  if (refreshTokenDoc && refreshTokenDoc.user) {

    //update login history for the user (could put this in a function)
    const logout_time = new Date();
    const user = await User.findById(refreshTokenDoc.user);
    //sort login times in descending order to get last login (by finding associated user)
    const last_login = await LoginHistory.findOne({ user }).sort({ login_time: -1 });
    // could get the user email to search instead of user if keeping email in login schema
    //const email = refreshTokenDoc.user.email;

    //update login entry
    if (last_login) {
      last_login.logout_time = logout_time;
      last_login.session_minutes = (last_login.logout_time - last_login.login_time)/60000;
      await last_login.save(); //save updates to the mongo entry
    } else {
    res.status(404).send('No login records found for this user');
    }

    //update total user interaction to include this session's total minutes
    user.interactionTime = user.interactionTime + last_login.session_minutes;
    await user.interactionTime.save();

    //await refreshTokenDoc.remove();
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
