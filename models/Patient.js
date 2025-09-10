const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Patient = sequelize.define(
  "Patient",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    age: DataTypes.INTEGER,
    ageMonths: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
  },
  {
    tableName: "patients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Patient;
