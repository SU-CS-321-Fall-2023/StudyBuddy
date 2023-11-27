const httpStatus = require('http-status');
const { Class } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClasses = async (filter, options) => {
  const classes = await Class.paginate(filter, options);
  return classes;
};


/**
 * Get class by ID
 * @param {string} classId
 * @returns {Promise<Class>}
 */
const getClassById = async (classId) => {
  const classObj = await Class.findById(classId);
  if (!classObj) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  return classObj;
};

module.exports = {
  queryClasses,
  getClassById,
};
