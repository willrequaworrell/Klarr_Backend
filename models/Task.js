const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date },
  column: { type: String, enum: ['today', 'upcoming', 'optional'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;