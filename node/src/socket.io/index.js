//npm init -y
//npm i cors express socket.io

//emitter events emitted along with data: socket.emit('event-name', data)
//listener events listen for emitted events and data: socket.on('event-name', callback(data))

//Rooms : A server-side-only concept that lets you
//create a room inside which you can listen to or emit events from multiple sources
//socket.to('room-name').emit('event-name', data)
const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const PORT = process.env.PORT || 5000
app.use(cors())
app.get('/', (req, res) => {
  req.send('Server is up and running')
})
http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
})

//create routes/ endpoints for each method
// make sure this can be accessed by web and mobile libraries--socket io clients?
//need a database for chats?

//TODO:
// connect schemas to users and studygroups in the socket code--make rooms based on studygroups
//TODO:
// a new message notification to pop up on messagesscreen
// on messagedetail screen, put the function to send messages
// create function to add the group to user/ user to group when they click the join button on the homepage
// already have something to let them know they joined on the message screen
// create something to alert group that a new person has joined the chat -- don't put parameters on group chat joining YET -- maybe next week
// to individually chat you need to check that they are a buddy first
//model this function off of the others--can disconnect a user, a user from a group, or a group

socket.on('disconnect', () => {
  console.log('A user disconnected');
});

//give each user a socketID in user schema and create function for this
  //--what about populate?does socketID need to be there or no?
//do we need to create studyGroupID? studyGroup controllers/validations?
io.on('connection', (socket) => {
  socket.on('alertForNewUser', async (studyGroupId) => {
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
io.on('connection', (socket) => {
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
      //.emit emits to all connected sockets
      //socket.broadcast.emit('hi'); broadcast leaves out the specific socket
      //set up a room for each group? will they get message notifications outside the app?
      //instead of the loop?
      group.users.forEach((user) => {
        io.to(user.socketId).emit('messageReceived', {studyGroupId, user, message });
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('chatError', 'Error sending message');
    }
  });
});

//make private send message function
//how to get the receiver's socket id--need a function that will call this
io.on("connection", socket => {
  socket.on("privateMessage", (receiverSocketId, msg) => {
    socket.to(receiverSocketId).emit("private message", socket.id, msg);
  });
});
