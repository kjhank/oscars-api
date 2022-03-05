const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('@models');
const { jwtConfig } = require('@static/config');

const { Op } = db.Sequelize;
const { user: User, role: Role } = db;

const signUp = ({ body }, res) => {
  User.create({
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    roles: body.roles ?? ['user'],
    username: body.username,
  })
    .then(user => {
      if (body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: body.roles,
            },
          },
        })
          .then(roles => {
            user.setRoles(roles).then(() => {
              res.send({
                message: 'User registered',
              });
            });
          });
      } else {
        user.setRoles([1]).then(() => {
          res.send({
            message: 'User registered.',
          });
        });
      }
    })
    .catch(error => {
      res.status(500).send({
        message: error.message,
      });
    });
};

const signIn = ({ body }, res) => {
  User.findOne({
    where: {
      username: body.username,
    },
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      const isPasswordValid = bcrypt.compareSync(body.password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid password',
        });
      }

      const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
        expiresIn: 86400,
      });

      const authorities = [];

      user.getRoles().then(roles => {
        roles.forEach(role => authorities.push(`ROLE_${role.name.toUpperCase()}`));
      });

      res.status(200).send({
        accessToken: token,
        email: user.email,
        id: user.id,
        roles: authorities,
        username: user.username,
      });
    })

    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};

module.exports = {
  signIn,
  signUp,
};
