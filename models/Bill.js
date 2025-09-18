const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Patient = require("./Patient");
const User = require("./User");
const Doctor = require("./Doctor");
const PrimaryCare = require("./PrimaryCare");

const Bill = sequelize.define(
  "Bill",
  {
    idNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },

    billType: { type: DataTypes.STRING, allowNull: false },

    doctorReferralFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    pcReferralFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    grossAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    extraDiscount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    due: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    receivedAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },

    archive: { type: DataTypes.BOOLEAN, defaultValue: false },
    archivedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },

    selectedTests: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  },
  {
    tableName: "bills",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // handles soft delete (uses deletedAt)
  }
);

// Associations
Bill.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });
Bill.belongsTo(User, { foreignKey: "receptionistId", as: "receptionist" });
Bill.belongsTo(Doctor, { foreignKey: "visitedDoctorId", as: "visitedDoctor" });
Bill.belongsTo(Doctor, { foreignKey: "doctorReferralId", as: "doctorReferral" });
Bill.belongsTo(PrimaryCare, { foreignKey: "pcReferralId", as: "pcReferral" });

module.exports = Bill;
