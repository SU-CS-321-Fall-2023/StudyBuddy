//create routes/ endpoints for each method
// make sure this can be accessed by web and mobile libraries--socket io clients?

//model this function off of the others--can disconnect a user, a user from a group, or a group
socket.on('disconnect', () => {
  console.log('A user disconnected');
});

//need to give each user a socketID?
//check the group schemas to make sure all these fields exist
io.on('connection', (socket) => {
  socket.on('startChat', async (groupId) => {
    try {
    //find the group by its ID, get each member and their socketID
      const group = await Group.findById(groupId).populate('members', 'socketId');
      // if groupId exists
      if (group) {
      //loop through each member in the group
        group.members.forEach((member) => {
        //chartStarted event emitted to each member's socketID with this message
          io.to(member.socketId).emit('chatStarted', `Chat started for group: ${group.name}`);
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
socket.on('sendMessage', async ({ groupId, userId, message }) => {
  try {
    const group = await Group.findById(groupId).populate('members', 'socketId');

    if (!group) {
      socket.emit('chatError', 'Group not found');
      return;
    }

    const user = await User.findById(userId); // Fetch user details from User model

    if (!user) {
      socket.emit('chatError', 'User not found');
      return;
    }

    // Emit the message along with user details to all members of the group
    group.members.forEach((member) => {
      io.to(member.socketId).emit('messageReceived', { groupId, user, message });
    });
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('chatError', 'Error sending message');
  }
});

