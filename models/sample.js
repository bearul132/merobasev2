const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  sampleId: { type: String, unique: true }, // Custom ID field

  sampleName: { type: String, required: true },

  projectSample: { 
    type: String, 
    enum: ['A', 'B'], 
    required: true 
  },

  projectNumber: { 
    type: Number, 
    min: 0, 
    max: 9999, 
    required: true 
  },

  sampleNumber: { 
    type: Number, 
    min: 0, 
    max: 9999, 
    required: true 
  },

  kingdom: { type: String, required: true },
  family: { type: String },
  genus: { type: String },
  species: { type: String },

  dateAcquired: { type: Date, required: true },

  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }
});

// Middleware: create sampleId automatically before saving
sampleSchema.pre('save', function(next) {
  const projectNum = this.projectNumber.toString().padStart(4, '0');
  const sampleNum = this.sampleNumber.toString().padStart(4, '0');
  this.sampleId = `${this.projectSample}-${projectNum}-${sampleNum}`;
  next();
});

module.exports = mongoose.model('Sample', sampleSchema);
