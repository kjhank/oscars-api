/* eslint-disable global-require */

const Sequelize = require('sequelize');
const { dbConfig } = require('@static');

const sequelizeConfig = {
  dialect: dbConfig.dialect,
  host: dbConfig.HOST,
  operatorAliases: false,
  pool: dbConfig.pool,
  port: dbConfig.PORT,
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, sequelizeConfig);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require('./User.model')(sequelize, Sequelize);
db.role = require('./Role.model')(sequelize, Sequelize);
db.refreshToken = require('./RefreshToken.model')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  foreignKey: 'roleId',
  otherKey: 'userId',
  through: 'user_roles',
});
db.user.belongsToMany(db.role, {
  foreignKey: 'userId',
  otherKey: 'roleId',
  through: 'user_roles',
});
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId',
  targetKey: 'id',
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
});

db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId',
  targetKey: 'id',
});

db.ROLES = ['user', 'admin'];

module.exports = {
  db,
};
