const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Patient = require("./Patient");
const User = require("./User_v2");
const Doctor = require("./Doctor");
const PrimaryCare = require("./PrimaryCare");

const Bill = sequelize.define(
  "Bill",
  {
    idNo: { type: DataTypes.STRING, allowNull: false, unique: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },

    billType: { type: DataTypes.STRING, allowNull: false },

    grossAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    extraDiscount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    due: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    receivedAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },

    archive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archivedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "bills_v2",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // handles soft delete (uses deletedAt)
  }
);

// Associations
Bill.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });
Bill.belongsTo(User, { foreignKey: "receptionistId", as: "receptionist" });

// Replaced doctorId → visitedDoctorId
Bill.belongsTo(Doctor, { foreignKey: "visitedDoctorId", as: "visitedDoctor" });

// Replaced referralId → doctorReferralId (references Doctor)
Bill.belongsTo(Doctor, {
  foreignKey: "doctorReferralId",
  as: "doctorReferral",
});

// New referral → pcReferralId (references PrimaryCare)
Bill.belongsTo(PrimaryCare, { foreignKey: "pcReferralId", as: "pcReferral" });

module.exports = Bill;
