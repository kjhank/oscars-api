require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
});

app.use(express.json());

const APP_PORT = process?.env?.APP_PORT ?? 8080;

app.listen(APP_PORT, () => console.log('running'));

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
  pool.end();
});
