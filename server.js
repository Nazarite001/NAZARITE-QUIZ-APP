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
const studentIdSchema = new mongoose.Schema({
  studentId: String,
  used: { type: Boolean, default: false }
});

const StudentId = mongoose.model('StudentId', studentIdSchema, 'students');



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


app.post('/api/quiz/validate', async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await StudentId.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student ID not found.' });
    }

    res.status(200).json({ message: 'Student ID is valid.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});



app.get('/api/quiz/check-student/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  const student = await StudentId.findOne({ studentId }); // ✅ fixed line

  if (student) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});


app.get('/teacher', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));