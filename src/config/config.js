require('dotenv').config();

module.exports = {
  "development": {
    "username": 'root',
    "password": '123456',
    "database": 'datn',
    // "username": process.env.DB_USERNAME,
    // "password": process.env.DB_PASSWORD,
    // "database": process.env.DB_DATABASE_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": "mysql",
    "logging": false,
    "timezone": "+07:00"
  },
  "test": {
    "username": 'root',
    "password": 'abcd123e',
    "database": 'datn',
    "host": "103.166.185.208",
    "port": 3306,
    "dialect": "mysql",
    "logging": false,
    "timezone": "+07:00"
  },
  "production": {
    "username": 'root',
    "password": 'abcd123e',
    "database": 'datn',
    // "username": process.env.DB_USERNAME,
    // "password": process.env.DB_PASSWORD,
    // "database": process.env.DB_DATABASE_NAME,
    "host": "103.166.185.208",
    // "host": process.env.DB_HOST,
    "port": 3306,
    "dialect": "mysql",
    "logging": false,
    "timezone": "+07:00"
  }
}