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
    if(query) {
      filter.$or = [
        { department_code: { $regex: query, $options: 'i' } }, 
        { department_name: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } }
      ];
    }
  
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
    const result = await classService.queryClasses(filter, options);
    res.send(result);
  });


module.exports = {
  getClasses
};
