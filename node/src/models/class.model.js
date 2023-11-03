const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const classSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        department: {  // possibly make enum cuz categories? but do we want it able to auto-update? how would we do that
            type: String,
            required: true,
        },
        code: {  // course code
            type: String,
            length: 4,
            required: true,
            unique: true,  // cuz each class has its own code
        },
        description: {
            type: String,
        },
        keywords: {  // to help in searching for classes
            type: [String],
        },
        isactive: {  // if the course is active or archived/gone
            type: Boolean,
            default: true,
        },
    }
);

classSchema.plugin(toJSON);
classSchema.plugin(paginate);

const Class = mongoose.model('Class', classSchema);

module.exports = Class;