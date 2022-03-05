const { verifySignup } = require('@middleware');
const controller = require('@controllers/auth.controller');
const { routes } = require('@static/routes');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post(
    routes.SIGNUP,
    [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkIfRolesExist],

    controller.signUp
  );

  app.post(routes.SIGNIN, controller.signIn);
};
