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
	const { userId, column, dueDate } = req.body;
	let newOrder = 0;

	if (column !== 'upcoming') {
		const highestOrderTask = await Task.findOne({ userId, column })
		  .sort({ order: -1 })
		  .limit(1);
		
		newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;
	  }

    const task = new Task({
      ...req.body,
      order: column === 'upcoming' ? null : newOrder
    });
    console.log(task)
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
});

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
	try {
		const tasks = await Task.find({ userId: req.params.userId });
		const sortedTasks = tasks.sort((a, b) => {
			if (a.column !== b.column) {
				return ['today', 'upcoming', 'optional'].indexOf(a.column) - 
				['today', 'upcoming', 'optional'].indexOf(b.column);
			} else if (a.column === 'upcoming') {
				return new Date(a.dueDate) - new Date(b.dueDate);
			} else {
				return a.order - b.order;
			}
		})
		res.json(sortedTasks)
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});


// update many tasks
router.patch('/reorder', async (req, res) => {
	try {
	  const { tasks } = req.body;
	  for (let task of tasks) {
		await Task.findByIdAndUpdate(task.id, { order: task.order });
	  }
	  res.status(200).json({ message: 'Tasks reordered successfully' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  });


// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
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