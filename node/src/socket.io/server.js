// put this in the server.js
const {addUser} = require('./user')
io.on("connection", (socket) => {

  //listens for any connection from client with the name "join"
  socket.on("join", ({ name, room }, callBack) => {
    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) return callBack(error);

    socket.join(user.room);
    callBack(null);
  });
//The rest of the code

// in server.js
//tell other users in the group that a new user has joined
socket.broadcast
  .to(user.room)
  .emit("message", { user: "Admin", text: `${user.name} has joined!` })
// connect to the event join from the client and emit the inputted name and room to the server
useEffect(() => {
 // The rest of the code
  socket.emit("join", { name, room }, (error) => {
    if (error) alert(error);
  });
}, [location.search]);

// in server. js
// create connection for sendMessage event
socket.on("join", ({ name, room }, callBack) => {

  //The rest of the code

  socket.on("sendMessage", ({ message }) => {
    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });
  });
});
