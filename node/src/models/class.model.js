const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const classSchema = mongoose.Schema({
  department_name: {
    type: String,
    required: true,
    trim: true,
  },
  department_abbrev: {
    type: String,
    required: true,
    trim: true,
  },
  department_code: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
  },
});

classSchema.plugin(toJSON);
classSchema.plugin(paginate);

const Class = mongoose.model('Class', classSchema);

module.exports = Class;