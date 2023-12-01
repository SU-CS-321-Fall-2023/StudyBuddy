// emit a welcome message to the user when the user joins a room (a study group)
// when the user sends a message, it has to be sent to the server and then send it back to the client
// server emits message and client receives it
// chat.js
const [messages, setMessages] = useState([]);
useEffect(() => {
  socket.on("message", (message) => {
    setMessages((messages) => [...messages, message]);
  });
}, []);


// still in chat.js
// connect to the connection created by our client from server.js
io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callBack) => {

    //The rest of the code

    socket.emit("message", {
      user: "Admin",
      text: `Welocome to ${user.room}`,
    });

//now we're at the actual sending messages point
// chat.js
// actually sending a message
const handleSubmit = (e) => {
  e.preventDefault();
  if (message) {
    socket.emit("sendMessage", { message });
    setMessage("");
  } else alert("empty input");
};

return (
  <div>

    // The rest of the code

    <form action="" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input type="submit" />
    </form>
  </div>
  );
