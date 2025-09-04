const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const User_v2 = sequelize.define(
  "User_v2",
  {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("super_admin", "admin", "reception"),
      defaultValue: "reception",
    },
  },
  {
    tableName: "users_v2",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User_v2;
