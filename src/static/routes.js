module.exports = {
  routes: {
    ROOT: '/api',
    auth: {
      REFRESH_TOKEN: '/api/auth/refreshtoken',
      SIGNIN: '/api/auth/signin',
      SIGNUP: '/api/auth/signup',
    },
    test: {
      ADMIN: '/api/test/admin',
      ALL: '/api/test/all',
      USER: '/api/test/user',
    },
  },
};
