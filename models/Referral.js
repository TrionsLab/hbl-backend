const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Referral = sequelize.define(
  "Referral",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("doctor", "pc"), allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    fee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  },
  {
    tableName: "referrals_v2",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Referral;
