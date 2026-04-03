import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true
  },
  matchedSourceId: {
    type: Number,
    default: null
  },
  similarityScore: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  rewriteSuggestion: {
    type: String,
    default: ""
  },
  ownershipExplanation: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Analysis', AnalysisSchema);
