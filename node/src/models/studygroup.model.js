const mongoose = require('mongoose');

const studyGroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  // Add other properties related to the study group if needed
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;