const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const resultSchema = new mongoose.Schema({
  studentId: String,
  score: Number,
  totalQuestions: Number,
  percentage: String,
  incorrectAnswers: [{
    question: String,
    selected: String,
    correct: String
  }],
  timestamp: String
});

const Result = mongoose.model('Result', resultSchema);

app.post('/api/quiz/results', async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).send('Result saved');
  } catch (error) {
    res.status(500).send('Error saving result');
  }
});

app.get('/api/quiz/results', async (req, res) => {
  try {
    const results = await Result.find().sort({ timestamp: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).send('Error fetching results');
  }
});

app.get('/teacher', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));