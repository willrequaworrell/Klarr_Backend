const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Test backend running
router.get('/', async (req, res) => {
    try {
      res.json({"message": "hello world"})
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    console.log(req.body, req.params.id)
    
    const updateData = {};
    if (req.body.title) {
        updateData.title = req.body.title
    }
    if (req.body.column) updateData.column = req.body.column;
    updateData.updatedAt = Date.now();
    console.log(updateData)

    const task = await Task.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;