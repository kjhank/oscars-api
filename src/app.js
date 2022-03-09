require('module-alias/register');
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const {
  corsConfig, urlEncodedConfig, routes,
} = require('@static');
const { db } = require('@models');

const { APP_PORT } = process.env;

const app = express();

app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(urlEncodedConfig));

app.get(routes.ROOT, (req, res) => {
  res.json({ healthCheck: '✅' });
});

require('@routes/auth.routes')(app);
require('@routes/user.routes')(app);

app.listen(APP_PORT, () => console.log(`running on ${APP_PORT}`));

const Role = db.role;

const initial = () => {
  Role.create({
    id: 0,
    name: 'user',
  });

  Role.create({
    id: 1,
    name: 'admin',
  });
};

(async () => {
  await db.sequelize.sync({ force: true });

  console.log('Drop and Resync Db');
  initial();
})();
