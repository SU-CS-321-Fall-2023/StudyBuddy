/*Since socket.io rooms is a server-side-only feature,
we need to manage the user list on the server.
This file acts as a user database for our room.
*/
let users = [];
exports.addUser = ({ id, name, room }) => {
  if (!name || !room) return { error: "name and room required." };
  const user = { id, name, room };
  users.push(user);
  return { user };
};


// user.js
// disconnection
exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return users[index];
};

//server.js
// emit disconnection method
const { addUser, removeUser } = require("./user");
io.on("connection", (socket) => {
    // The rest of the code

    socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    io.to(user.room).emit("message", {
      user: "Admin",
      text: `${user.name} just left the room`,
    });
    console.log("A disconnection has been made");
  });
 });
