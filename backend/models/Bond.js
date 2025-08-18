const mongoose = require("mongoose");

const bondSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // which employee the bond belongs to
    trainingCost: { type: Number, required: true },
    trainingProvider: { type: String, required: true },
    bondDuration: { type: Number, required: true }, // in months or years?
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Completed", "Breached"],
      default: "Active"
    },
    signedBondDoc: { type: String }, // path or URL to uploaded bond document
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin/staff who created it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bond", bondSchema);