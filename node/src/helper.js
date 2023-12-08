//called in auth.services.js in loginWithEmailAndPassword
async function addLoginHistory(user_email, login_time, logout_time, session_minutes) {
  try {
    const loginHistory = new LoginHistory({
    user_id,
    login_time,
    logout_time,
    session_minutes,
    });
    await loginHistory.save();
  } catch (error) {
    console.error('Error adding login history to the database:', error);
  }
}

function get_last_login_entry(user_id) {
    const last_login = await LoginHistory.findOne({ user_id }).sort({ login_time: -1 });
    return last_login;
}

//TODO:
//for stats
function get_online_user_count() {

}

function get_day_difference(time1, time2) { // passed in as a date
  time1 = moment(time1).startOf('day'); // make them moments and set HMS = 0
  time2 = moment(time2).startOf('day');
  time_diff = Math.abs(time1.getTime() - time2.getTime());
  day_diff = Math.ceil(time_diff / (1000 * 3600 * 24));
  return day_diff;
}

//for stats -- put this just in stats function?
//might want just this alone though so maybe leave it for now
function get_last_login_time(user_id) {
    const last_login = await LoginHistory.findOne({ user_id }).sort({ login_time: -1 });
    return last_login.login_time;
}

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
  all_last_logins.sort((a, b) => a.last_login - b.last_login);
  //loop through the list
  all_last_logins.forEach(login => {
    user_id = login.user._id; //get user from login schema, then id from user schema
    //user_id = login._id
    last_login = login.last_login;

    if (last_login) {
      last_login_date = get_last_login_time(user_id);
      current_date = date;
      day_diff = get_day_difference(current_date, last_login_date);

      if (day_diff <= 14) {
        break; // all users after this will be within two weeks
      } else {
        // add user email and number of days to a list since diff > 14
        email_list.push({user_email: login.user.email, user_name: login.user.name, days_since_login: day_diff});
      }
    }
  })
  return email_list;
}

//TODO:
//for stats
function get_average_session_time(user_id) {
  try {
    const result = await LoginHistory.aggregate([
      { $match: { user: mongoose.Types.ObjectId(user_id) } },
      {
        $group: {
          _id: null,
          totalSessionTime: { $sum: '$session_minutes' }, // Calculate the total session time
          count: { $sum: 1 } // Count the number of sessions
        },
      },
      {
        $project: {
          _id: 0,
          averageSessionTime: { $divide: ['$totalSessionTime', '$count'] } // Calculate the average session time
        }
      }
    ]);

    if (result.length > 0) {
      return ave_time = result[0].averageSessionTime;
       return `${ave_time} minutes`// Return the average session time in minutes
    } else {
      return '0 minutes'; // Return 0 if no records found for the user
    }
  } catch (error) {
    throw error;
  }
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
    return '0 hours';
  }
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

// call check buddy count/ group count when groups/ buddies added or removed
function check_buddy_count(user_id) {
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

//call this when the profile button is clicked


function get_user_stats(user_id) {
  const user = await User.findById(user_id);
  //faster to not call the functions and just do them here instead so you dont have to look for the user so many times
  const stats = [
    {key: 'Total Interaction Time', value: get_total_interaction_time(user_id)},
    {key: 'Average/ Median Session Time', value: get_average_session_time(user_id)},
    {key: 'Last Login Date', value: get_last_login_time(user_id)},
    {key: 'Number of Logins', value: user.loginHistory.length},
    {key: 'Daily Login Streak', value: get_login_streak(user_id)},
    {key: 'Number of Buddies', value: user.buddies.length},
    {key: 'Number of Study Groups', value: user.studyGroups.length},
  ];
  user.stats = stats;
  await user.save();
  return user.stats;
  //const statsJSON = JSON.stringify(stats); // Convert to JSON
  //return statsJSON;
}


