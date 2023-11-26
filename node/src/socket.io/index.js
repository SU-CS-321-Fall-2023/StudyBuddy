//create routes/ endpoints for each method
// make sure this can be accessed by web and mobile libraries--socket io clients?


//model this function off of the others--can disconnect a user, a user from a group, or a group
socket.on('disconnect', () => {
  console.log('A user disconnected');
});

//give each user a socketID in user schema and create function for this
  //--what about populate?does socketID need to be there or no?
//do we need to create studyGroupID? studyGroup controllers/validations?
io.on('connection', (socket) => {
  socket.on('startChat', async (studyGroupId) => {
    try {
    //find the group by its ID, get each member and their socketID
      const group = await StudyGroup.findById(studyGroupId).populate('users', 'socketId');
      // if groupId exists
      if (group) {
      //loop through each member in the group
        group.users.forEach((user) => {
        //chartStarted event emitted to each member's socketID with this message
          io.to(user.socketId).emit('chatStarted', `Chat started for group: ${group.name}`);
        });
      } else {
        // Handle if group not found
        socket.emit('chatError', 'Group not found');
      }
    } catch (error) {
      // Handle errors
      console.error('Error starting chat:', error);
      socket.emit('chatError', 'Error starting chat');
    }
  });
});

//sending message in a group from a user
//add in a check that the user is in the group
//make sure that the message displays correctly
socket.on('sendMessage', async ({ studyGroupId, userId, message }) => {
  try {
    const group = await StudyGroup.findById(studyGroupId).populate('users', 'socketId');
    if (!group) {
      socket.emit('chatError', 'Group not found');
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      socket.emit('chatError', 'User not found');
      return;
    }

    // Emit the message (along with user details?) to group members
    group.users.forEach((user) => {
      io.to(user.socketId).emit('messageReceived', {studyGroupId, user, message });
    });
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('chatError', 'Error sending message');
  }
});

