const mongoose = require('mongoose');

const loginHistorySchema = mongoose.Schema({
  user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
  },
  login_time: {
    type: Date,
    required: true,
    trim: true,
  },
  logout_time: {
    type: Date,
    required: true,
    trim: true,
   },
  session_minutes: {
    type: Number
    required: true
  }
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;


//TODO:
//set up rooms / connect to database for linking study groups and users
//login streak badge function checked everytime they login--DONE
//group badge checked everytime they join a group--find the join function
//buddy badge checked everytime they join a group--find the join function
//routing

//for actually joining groups, go to homepage.js
//connecting with buddies is matchingscreen.js
//make buddy connection function (add them to database)
//add buddy id list to user schema
//make study group connection (add them to database)
//go to matchingscreen.js
