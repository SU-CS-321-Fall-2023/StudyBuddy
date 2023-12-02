const mongoose = require('mongoose');

const loginHistorySchema = mongoose.Schema({
  user: {
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
/*
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

async function addLoginHistory(user_email, login_time, logout_time, session_minutes) {
  try {
    const loginHistory = new LoginHistory({
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

function get_day_difference(time1, time2) { // passed in as a date
  time1 = moment(time1).startOf('day'); // make them moments and set HMS = 0
  time2 = moment(time2).startOf('day');
  time_diff = Math.abs(time1.getTime() - time2.getTime());
  day_diff = Math.ceil(time_diff / (1000 * 3600 * 24));
  return day_diff;
}

//TODO: for email notif list of user emails
function create_email_reminder_list() {
  const email_list = [];
  const all_last_logins = await loginHistory.aggregate([
      {
        $sort: { login_time: -1 } // Sort by login_time in descending order
      },
      {
        $group: {
          _id: '$user_id', // Group by user_id
          last_login: { $first: '$login_time' } // Get the first most recent login_time for each user
        }
      }
    ]);



  // all_last_logins is a list of user_ids login times for each user
  /*
  [
  { _id: 'user_id_1', latestLogin: new Date('2023-11-24') },
  { _id: 'user_id_2', latestLogin: new Date('2023-11-25') },
  ]*/
  // Sort all_last_logins so that latestLogin is in descending order (most recent at front)
  //find where date difference is less than 14, and stop adding people to the list (because everyone after has logged in in good time)
  all_last_logins.sort((a, b) => a.last_login - b.last_login);
  // this is called arrow function syntax, same as :
  //function (a, b){
  //return a - b;
//}

  //loop through the list
  all_last_logins.forEach(login => {
    user_id = login.user._id //get user from login schema, then id from user schema
    //user_id = login._id
    last_login = login.last_login

    if (last_login) {
      last_login_date = get_last_login_time(user_id);
      current_date = date;
      day_diff = get_day_difference(current_date, last_login_date);

      if (day_diff > 14) {
        // add user email and number of days to a list
        email_list.push({user_email: login.user.email, user_name: login.user.name, days_since_login: day_diff})
      }
  }
})

}

// for user stats
//should I make a stats schema instead of making functions to get all of these things?
//if I do, I need to update the stats schema anytime any info changes--is it really that much simpler?
//by using the functions, don't have to store more info that could just be gotten with a function

//TODO:
//return as a JSON? or a response?
function get_user_stats(user_id) {
  const user = await User.findById(user_id);
  //faster to not call the functions and just do them here instead so you dont have to look for the user so many times
  stats = [
    {key: 'Total Interaction Time', value: get_total_interaction_time(user_id)},
    {key: 'Average/ Median Session Time', value: get_median_session_time(user_id)},
    {key: 'Last Login Date', value: get_last_login_time(user_id)},
    {key: 'Number of Logins', value: user.loginHistory.length},
    {key: 'Daily Login Streak', value: get_login_streak(user_id)},
    {key: 'Number of Buddies', value: user.buddies.length},
    {key: 'Number of Study Groups', value: user.studyGroups.length},
  ];
  const statsJSON = JSON.stringify(stats); // Convert to JSON
  return statsJSON;
}
/* Don't need this for anything, not a very helpful stat
function get_login_count(user_id) {
    const user = await User.findById(user_id);
    const loginCount = user.loginHistory.length;
    return loginCount;
    //return loginHistory.countDocuments({ user_id }); //SLOW
} */

//for stats -- put this just in stats function?
//might want just this alone though so maybe leave it for now
function get_last_login_time(user_id) {
    const last_login = await LoginHistory.findOne({ user_id }).sort({ login_time: -1 });
    return last_login.login_time;
}

//TODO:
//for stats
function get_median_session_time(user_id) {
  //const session_times = await LoginHistory.find({ user_id });
  LoginHistory.aggregate([
    { $match: { user:  mongoose.Types.ObjectId(user_id) } }, // Match documents for the specified user ID
    {
      $group: {
        _id: null, // Group by all documents
        totalSessionTime: { $push: '$sessionTime' }, // push all session times to an array
      },
    },
  ])
  //now calculate median of the array
  const medianTime = all_logins[0].totalSessionTime;
  const medianTimeString = '${medianTime} minutes';
  return medianTimeString;
}

//for stats
function get_total_interaction_time(user_id) {
  const all_logins = await LoginHistory.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(user_id) // Convert user_id to ObjectId
      }
    },
    {
      $group: {
        _id: null,
        totalSessionTime: { $sum: "$session_minutes" }
      }
    }
  ])
  //all_logins is an array with a single object, the session minutes
  if (all_logins.length > 0) {
    const totalHours = all_logins[0].totalSessionTime/60; //minutes to hours
    const totalHoursString = '${totalHours} hours';
    return totalHoursString;
  } else {
    return 0;
  }
}

//TODO:
//for stats
function get_online_user_count() {
}

// for a badge and stats
//every time a user logs in, check their login streak to see if badge needs taken away
function get_login_streak(user_id) {
  // get the array of all logins for a user, sorted from most to least recent
  const all_logins = await LoginHistory.find({ user }).sort({ login_time: -1 });
  streak = 0;
  if (all_logins.length > 0) { // if they've logged in before
    // Get today's date to compare to first entry; start of day sets to midnight of the day so hours, min, sec not considered
    //current_date = moment().startOf('day');
    current_date = date();
    //loop through login time list
    for (i = 0; i < all_logins.length; i++) {
      //get last_login_date in matching format to current date
      //last_login_date = moment(all_logins[i].login_time).startOf('day');
      last_login_date = all_logins[i].login_time;
      day_diff = get_day_difference(current_date, last_login_date);
      //time_diff = Math.abs(current_date.getTime() - last_login_date.getTime());
      //day_diff = Math.ceil(time_diff / (1000 * 3600 * 24));
      if (day_diff > 1) { //days are NOT sequential, there is a gap in time, stop the streak at current value
          break;
      } else if (day_diff == 1) { // days ARE sequential
        streak++; //add to streak
        current_date = last_login_date; //update current date to be the login date
        //login date moves to next date on next loop through
      }
    }
  return streak;
}


//for a badge
//figure out how to separate group count into created and to do badges separately?
// returns study group count -- use this function in a separate badge function, call the badge function whenever a new group is joined
function get_group_count(user_id) {
    const user = await User.findById(user_id);
    const studyGroupsCount = user.studyGroups.length;
    return studyGroupsCount;
    //return studyGroups.countDocuments({ user_id }); //SLOW
}

// for a badge
// add buddies to user schema (based on their user_ids)
function get_buddy_count(user_id) { //check # of friends everytime they make a new one
    const user = await User.findById(user_id);
    const buddyCount = user.buddies.length;
    return buddyCount;
    //return buddiesUser.findById(user_id);.countDocuments({ user_id }); //SLOW
}

//ask Anas about calling the update method and how it should look in the schema
// call check buddy count/ group count when groups/ buddies added or removed
function check_buddy_count(user_id) {
//updateUserById(user_id, updateBody)
  count = get_buddy_count(user_id);
  const user = await User.findById(user_id);
  if (count = 20) {
    // give the expert buddy badge for reaching max_threshold
    user.badges['Buddy Badge:'] = 'Loyal Buddy';
  } else if (count = 10) {
    //give friendly buddy badge for lots of buddies
    user.badges['Buddy Badge:'] = 'Friendly Buddy';
  } else if (count = 1) {
    //give beginning buddy badge for first buddy
    user.badges['Buddy Badge:'] = 'Beginner Buddy';
  } else if (count = 0) {
    user.badges['Buddy Badge:'] = 'No buddies yet, but keep trying!';
  }
  user.save();
}

function check_group_count(user_id) {
  count = get_group_count(user_id);
  const user = await User.findById(user_id);
  if (count = 10) {
    // give the smarty-pants buddy badge for reaching max_threshold
    user.badges['Study Group Buddy Badge:'] = 'Smarty-Pants Study Buddy';
  } else if (count = 4) {
    //give super-studious buddy badge for lots of buddies
    user.badges['Study Group Buddy Badge:'] = 'Super-Studious Study Buddy';
  } else if (count = 1) {
    //give involved buddy badge for first group
    user.badges['Study Group Buddy Badge:'] = 'Beginner Study Buddy';
  } else if (count = 0) {
    user.badges['Study Group Buddy Badge:'] = 'No groups yet, but keep trying!';
  }
  user.save();
}

function check_login_streak(user_id) {
  day_count = get_login_streak(user_id)
  const user = await User.findById(user_id);
    if (day_count > 30) {
      // "on the overachiever path" streak badge
      user.badges['Daily Login Streak Badges:'] = 'Overachiever Level';
      // include day_count in the badge
    } else if (day_count > 14) {
      // "steady study-er" streak badge
      user.badges['Daily Login Streak Badges:'] = 'Steady Studier Level';
      // include day_count in the badge
    } else if (day_count > 5) {
    // include day_count in the badge
      user.badges['Daily Login Streak Badges:'] = 'Week-Long Warrior Level';
    // "week-long warrior" streak badge
    } else if (day_count > 3) {
      // include day_count in the badge
      user.badges['Daily Login Streak Badges:'] = 'Getting Studious Level';
      // "week-long warrior" streak badge
    } else if (day_count == 0) {
    // take away any streak badge earned, or set to this the first time they login
      user.badges['Daily Login Streak Badges:'] = 'No streak badge available for today. Maybe tomorrow!';
    //notify them that they lost their streak
  }
  user.save();
}


//every time someone logs out make sure to:
  //add a new login entry--DONE
  //separate the logic into functions--DONE
  //change email to user schema in login history--DONE
  //does login history need to be in user schema--DONE
//for stats:
  //TODO: get_online_users, get_median_session_time
  //get_total_interaction_time, from the user schema (based on user id)
  //get session_minutes (for one session, based on date)
  //get user stats function
  //get online_users
//for badges:
  //login streak--when they login
  //number of friends--everytime they make a friend, check
  //number of study groups--separate into created/ joined
//last_login for email list function

//take the repetitiveness out of getting / checking counts somehow-- a list of related schemas
//do I need to run the updateuser by id function at any time to save info?
// add badge list into schema -- make it a dictionary so that streak has multiple keys that can be deleted if streak stops

//make check functions for all the get functions to check if they should get the badge)
//make the giving badge functions too -- can you connect this to a push notification?

//need to create endpoint/ routes for each function
}


//TODO:
//email list function--DONE
//call stats function -- Sisi
//set up rooms / connect to database for linking study groups and users
//do average or median session time for a user
//login streak badge function checked everytime they login--DONE
//group badge checked everytime they join a group--find the join function
//buddy badge checked everytime they join a group--find the join function
//check badges functions and make sure they can be displayed (testing)
//make sure functions exist to join a study group and make buddies
//make sure the routes work!!

//for actually joining groups, go to homepage.js
//connecting with buddies is matchingscreen.js
//make buddy connection function (add them to database)
//add buddy id list to user schema
//make study group connection (add them to database)
//go to matchingscreen.js
