const mongoose = require('mongoose');

const loginHistorySchema = mongoose.Schema({
  user_email: {
    type: String
    required: true
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

//function to calculate time difference
//when login occurs
//const login_date = new Date();
//when logout occurs
//const logout_date = new Date();
//add login_date, logout_date, and user_email to the login_history collection--
//is it automatically linked to the user collection too now?

//stats functions
function getSessionMinutes(date1, date2) {
    return (date2 - date1)/60000
}
session_minutes = getSessionMinutes(login_date, logout_date);
console.log(typeof(session_minutes)) // a number
//add session_minutes to total interaction
//check total interaction of a user daily
//means store their total interaction as a variable for a user,
//so you dont have to calculate this everyday start to finish for every user
//because badge checks will be run daily, so dont want to do so many computations at that one time
//have this total interaction already situated
//total_interaction+=session_minutes;

// by making this a schema, can keep track of one user's login/ logout data, and compare it to that of other users
// is socket.io capable of same thing? do I need to make this a whole new collection in the database?


// in login function auth.controller
  // add User.setLoginEntry(email) # syntax for email?
// in logout function auth.controller
  //add class_whatever.updateLoginHistory(email)
/*
function setLoginEntry(email) {
  const login_date = new Date();
  // add new entry to mongo based on email
}

function setSessionMinutes(date1, date2) {
    return (date2 - date1)/60000
}

function updateLoginHistory(email) {
  logout_date = getCurrentDateTime()
  // get the last entry for this email, get login_date
  login_date = // Mongo get with email
  session_minutes = setSessionMinutes(login_date, logout_date);
  //add entry
  //updateUser(
  //look at login req.body email, password for form
  //getuser by id is mongoose code
}
*/
function setSessionMinutes(date1, date2) {
    return (date2 - date1)/60000
}

async function addLoginHistory(user_email, login_time, logout_time, session_minutes) {
  try {
    const loginHistory = new UserLoginHistory({
    user_email,
    login_time,
    logout_time,
    session_minutes,
    });
    await loginHistory.save();
  } catch (error) {
    console.error('Error adding login history to the database:', error);
  }
}

//every time someone logs out make sure to update the interaction time too for the user
//functions to make:
//get_total_interaction_time, from the user schema (based on user id)
//get session_minutes (for one session, based on date)
//mongo entry functions above
//for badges:
//check total interaction time
//number of logins
//number of chat interactions
//number of friends?

//need to create endpoint/ routes for each function
}
