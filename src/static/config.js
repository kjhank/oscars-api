require('dotenv').config();

module.exports = {
  corsConfig: {
    origin: `http://localhost:${process.env.APP_PORT}`,
  },
  dbConfig: {
    DB: process.env.PGDATABASE,
    HOST: process.env.PGHOST,
    PASSWORD: process.env.PGPASSWORD,
    PORT: process.env.PGPORT,
    USER: process.env.PGUSER,
    dialect: 'postgres',
    pool: {
      acquire: 30000,
      idle: 10000,
      max: 5,
      min: 0,
    },
  },
  jwtConfig: {
    secret: process.env.JWT_SECRET,
  },
  urlEncodedConfig: {
    extended: true,
  },
};
