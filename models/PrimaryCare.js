const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const PrimaryCare = sequelize.define(
  "PrimaryCare",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    address: DataTypes.STRING,
    fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    deletedAt: { type: DataTypes.DATE, allowNull: true }, // soft delete column
  },
  {
    tableName: "primary_care_v2",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // enables soft delete
  }
);

module.exports = PrimaryCare;
