const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const classRoute = require('./class.route');
const config = require('../../config/config');
const studygroupRoute = require('./studyGroup.route')
const chatRoute = require('./chat.route')
const privateChatRoute = require('./private.chat')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/classes',
    route: classRoute,
  },
  {
    path: '/studygroups',
    route: studygroupRoute,
  },
  {
    path: '/chat',
    route: chatRoute
  },
  {
    path: '/private-chat',
    route: privateChatRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
