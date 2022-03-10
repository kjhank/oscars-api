module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        isEmail: {
          msg: 'auth.emailInvalid',
        },
        notEmpty: {
          msg: 'auth.emailRequired',
        },
        notNull: {
          msg: 'auth.emailRequired',
        },
      },
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [8],
          msg: 'auth.passwordTooShort',
        },
        notEmpty: {
          msg: 'auth.emailRequired',
        },
        notNull: {
          msg: 'auth.passwordRequired',
        },
      },
    },
    username: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: 'auth.emailRequired',
        },
        notNull: {
          msg: 'auth.usernameRequired',
        },
      },
    },
  });

  return User;
};
