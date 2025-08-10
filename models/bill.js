// models/Bill.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

const Bill = sequelize.define('Bill', {
  idNo: DataTypes.STRING,
  date: DataTypes.DATEONLY,
  time: DataTypes.TIME,
  receptionist: DataTypes.STRING,
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  ageMonths: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  phone: DataTypes.STRING,
  billType: DataTypes.STRING,
  doctor: DataTypes.STRING,
  referralDoctorFee: DataTypes.DECIMAL(10, 2),
  referralDoctorName: DataTypes.STRING,
  referralPcName: DataTypes.STRING,
  referralPcFee: DataTypes.DECIMAL(10, 2),
  grossAmount: DataTypes.DECIMAL(10, 2),
  discount: DataTypes.DECIMAL(10, 2),
  extraDiscount: DataTypes.DECIMAL(10, 2),
  due: DataTypes.DECIMAL(10, 2),
  totalAmount: DataTypes.DECIMAL(10, 2),
  selectedTests: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'bills',
  timestamps: false,
});

module.exports = Bill;
