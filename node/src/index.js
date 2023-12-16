const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const cron = require('node-cron');
const { checkInactiveUsers } = require('./services/user.service');

const StudyGroup = require('../src/models/studygroup.model')
const PrivateMessage = require('../src/models/private.message.model')

const http = require('http').Server(app);

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = http.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // Schedule sending login reminder emails to inactive users everyday at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Running checkInactiveUsers job...');
      const inactiveUsers = await checkInactiveUsers();
      logger.info('Successfuly sent emails to inactive users');
      logger.info(`Inactive users: ${inactiveUsers}`);
    } catch (error) {
      logger.error(`Error in checkInactiveUsers job: ${error.message}`);
    }
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

  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId)
    console.log('user joined the chat')
  });

  socket.on('leaveChat', ({ chatId }) => {
    socket.leave(chatId)
    console.log('user left the chat')
  });

  socket.on('groupChatMessage', async ({ groupId, message }) => {
    const group = await StudyGroup.findByIdAndUpdate(
      groupId,
      { $push: { messages: message } },
      { new: true, useFindAndModify: false }).populate('messages.user')

    io.to(groupId).emit('newMessage', {
      message: group.messages
    })
  })

  socket.on('ChatMessages', async ({ groupId }) => {
    const group = await StudyGroup.findById(groupId).populate('messages.user')
    io.to(groupId).emit('newMessage', {
      message: group.messages
    })
  })

  socket.on('privateChatMessage', async ({ chatId, message }) => {
    const chat = await PrivateMessage.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } },
      { new: true, useFindAndModify: false }).populate('messages.user')

    io.to(chatId).emit('newPrivateMessage', {
      privateMessage: chat.messages
    })
  })

  socket.on('privateMessages', async ({ chatId }) => {
    const chat = await PrivateMessage.findById(chatId).populate('messages.user')
    io.to(chatId).emit('newPrivateMessage', {
      privateMessage: chat.messages
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
