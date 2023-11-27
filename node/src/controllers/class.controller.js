const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { classService } = require('../services');

const getClasses = catchAsync(async (req, res) => {
  // Get search query
  const query = req.query.search;

  // Build filter object
  const filter = {};
  if (query) {
    const searchTerms = query.split(' ');

    // Create an array of conditions for each search term
    const orConditions = searchTerms.map(term => ({
      $or: [
        { department_code: { $regex: term, $options: 'i' } },
        { department_name: { $regex: term, $options: 'i' } },
        { class_title: { $regex: term, $options: 'i' } },
        { class_code: { $regex: term, $options: 'i' } },
      ],
    }));

    filter.$and = orConditions;
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await classService.queryClasses(filter, options);
  res.send(result);
});

//get all classes
const getAllClasses = catchAsync(async (req, res) => {
  const classes = await classService.getAllClasses();
  res.send(classes);
});


module.exports = {
  getAllClasses,
  getClasses,
};
