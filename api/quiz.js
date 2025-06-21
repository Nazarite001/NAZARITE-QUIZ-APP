const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the schema
const studentSchema = new mongoose.Schema({
  studentId: String,
  used: { type: Boolean, default: false }
});

// Define the model
const Student = mongoose.model('Student', studentSchema);

// Validate Student ID route
router.post('/validate', async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student ID not found.' });
    }

    if (student.used) {
      return res.status(400).json({ message: 'Student ID has already been used.' });
    }

    return res.status(200).json({ message: 'Student ID is valid.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
});

module.exports = router;
