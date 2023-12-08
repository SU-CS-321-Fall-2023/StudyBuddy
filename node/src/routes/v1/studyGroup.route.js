const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const studyGroupValidation = require('../../validations/studygroup.validation');
const studyGroupController = require('../../controllers/studyGroup.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(studyGroupValidation.createStudyGroup), studyGroupController.createStudyGroup)

router
  .route('/:studygroupId')
  .put(validate(studyGroupValidation.joinStudyGroup), studyGroupController.joinStudyGroup);

router
  .route('/search')
  .post(studyGroupController.searchStudyGroup)
router
  .route('/:userId')
  .get(studyGroupController.getStudyGroups)

module.exports = router;