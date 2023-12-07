const mongoose = require('mongoose');

const statsSchema = mongoose.Schema({
  user_email: {
    type: String
    required: true
  },
  interactionTime: {
     type: number,
     default: 0,
   },

});

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
