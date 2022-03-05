module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('roles', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  return Role;
};
