const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { 
    type: String, 
    required: true 
  },
  inputFormat: { 
    type: String, 
    required: true 
  },
  outputFormat: { 
    type: String, 
    required: true 
  },
  constraints: { 
    type: String 
  },
  sampleInput: { 
    type: String 
  },
  sampleOutput: { 
    type: String 
  },
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
