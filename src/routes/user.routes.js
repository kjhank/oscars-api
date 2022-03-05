const { verifyToken, isAdmin } = require('@middleware');
const controller = require('@controllers/user.controller');
const { routes } = require('@static/routes');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Alow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get(routes.test.ALL, controller.allAccess);
  app.get(routes.test.USER, [verifyToken], controller.userBoard);
  app.get(routes.test.ADMIN, [verifyToken, isAdmin], controller.adminBoard);
};
