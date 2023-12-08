const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const cron = require('node-cron');
const { checkInactiveUsers } = require('./services/user.service');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
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
