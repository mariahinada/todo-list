const express = require('express');
const router = express.Router();    
const Task = require('../models/task');

router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

router.post('/', async (req, res) => {
    const newTask = new Task({ title: req.body.title });
    const saved = await newTask.save();
    res.status(201).json(saved);
});

router.put('/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
