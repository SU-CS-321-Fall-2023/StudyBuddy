/*const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const loginHistory = require('../../validations/loginHistory.validation');
const loginHistory = require('../../controllers/loginHistory.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(validate(loginHistory.getEntry), loginHistory.getEntry)
  .patch(loginHistory.updateEntry)

router.post('//', userController.rejectFriendRequest)

module.exports = router;
*/
