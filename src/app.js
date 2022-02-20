require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generic, users } = require('./routes');

const APP_PORT = process?.env?.APP_PORT ?? 8080;

const corsConfig = {
  origin: `http://localhost:${APP_PORT}`,
};

const app = express();

app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(express.json());
app.use(users);
app.use(generic);
app.use(bodyParser.urlencoded({ extended: true }));

app.use((error, req, res, next) => {
  // console.log({ error });

  console.log(error.statusCode);

  if (error.statusCode) {
    res.status(error.statusCode).send(error.message);
  } else {
    res.status(500).send('Unknown error');
  }
});

app.listen(APP_PORT, () => console.log('running'));
