// models/Guest.js (ESM)
import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    attending: {
      type: Boolean,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    companions: {
      type: Number,
      min: 0,
      default: 0,
    },
    companionsNames: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    dietaryRestrictions: {
      type: Boolean,
      default: false,
    },
    dietaryNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    busOption: {
      type: String,
      enum: ['', 'oneway', 'roundtrip'],
      default: '',
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Guest', GuestSchema);
