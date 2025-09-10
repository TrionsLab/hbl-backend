const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Doctor = sequelize.define(
  "Doctor",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    specialization: DataTypes.STRING,
    fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  },
  {
    tableName: "doctors",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Doctor;
