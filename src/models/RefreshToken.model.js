const { jwtConfig } = require('@static');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define('refreshToken', {
    expiryDate: {
      type: Sequelize.DATE,
    },
    token: {
      type: Sequelize.STRING,
    },
  });

  RefreshToken.createToken = async function (user) {
    const expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + Number(jwtConfig.refreshExpiration));

    const token = uuidv4();
    const refreshToken = await this.create({
      expiryDate: expiredAt.getTime(),
      token,
      userId: user.id,
    });

    return refreshToken.token;
  };
  RefreshToken.verifyExpiration = token => token.expiryDate.getTime() < new Date().getTime();

  return RefreshToken;
};
