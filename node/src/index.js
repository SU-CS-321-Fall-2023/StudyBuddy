const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const StudyGroup = require('../src/models/studygroup.model')

const http = require('http').Server(app);

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = http.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3001",
  },
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.on('disconnect', () => {
    console.log('disconnecte')
  });

  socket.on('joinGroup', ({ groupId }) => {
    socket.join(groupId)
    console.log('user joined the group')
  });

  socket.on('leaveGroup', ({ groupId }) => {
    socket.leave(groupId)
    console.log('user left the group')
  });

  socket.on('groupChatMessage', async ({ groupId, message }) => {
    const group = await StudyGroup.findByIdAndUpdate(
        groupId,
      { $push: { messages: message } },
      { new: true, useFindAndModify: false }
    );
    console.log('id', groupId, 'ms', message, 'g', group)
    io.to(groupId).emit('newMessage', {
      message: group.messages
    })

  })

});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
