const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const Class = require('./class.model.js'); // Import the Class model
const StudyGroup = require('./studygroup.model.js'); // Import the StudyGroup model
const LoginHistory = require('./loginhistory.model.js'); // Import the LoginHistory model

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    studyGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGroup',
      },
    ],
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    badges: {
      type: mongoose.Schema.Types.Mixed,
      default:{}
      required: true
    },
    emailPreferences: {
      notifications: {
        type: Boolean,
        default: true, // User is opted-in by default
      },
    },
    badges: {
      type: [{
        key: String,
        value: String
       }],
       default: [{}]
    },
    stats: {
      type: [{
        key: String,
        value: mongoose.Schema.Types.Mixed
       }],
       default: [{}]
    },
    /*loginHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoginHistory',
      },
    ],
  },*/
    activity: {
      lastLogin: {
        type: Date
      }
    },
  },
  {
    timestamps: true, // what does this do?
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
