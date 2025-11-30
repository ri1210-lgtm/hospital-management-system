const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true,
  },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String },
    instructions: { type: String },
  }],
  tests: [{
    name: { type: String, required: true },
    instructions: { type: String },
  }],
  followUpDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for tenantId and search fields
prescriptionSchema.index({ tenantId: 1, patient: 1 });
prescriptionSchema.index({ tenantId: 1, doctor: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);