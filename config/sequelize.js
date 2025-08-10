// config/sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('clinic', 'root', 'admin', {
  host: 'mysql.railway.internal',
  dialect: 'mysql',
  port: 3306,
//   logging: false, // remove this line if you want SQL logs
});

module.exports = sequelize;