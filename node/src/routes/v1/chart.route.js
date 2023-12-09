const express = require('express');
const validate = require('../../middlewares/validate');
const groupChartValidation = require('../../validations/chart.validation');
const groupChartController = require('../../controllers/chart.controller');

const router = express.Router();

router
    .route('/:groupId')
    .put(validate(groupChartValidation), groupChartController.sendMessage)
    .post(validate(groupChartValidation), groupChartController.getGroupMessages)

module.exports = router