const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

const Reference = sequelize.define('Reference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'pc_doc_references',
  timestamps: false
});

module.exports = Reference;
