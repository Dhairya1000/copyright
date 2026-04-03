import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import { analyzeContent } from './controllers/analysisController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory File Uploads for parsing
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('⚠️ No MONGODB_URI found. Proceeding without database storage.');
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Copyright Guardian API is running' });
});

app.post('/api/analyze', upload.single('document'), analyzeContent);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
