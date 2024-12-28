const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');

router.get('/:userId', async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.params.userId });
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:userId', async (req, res) => {
  try {
    let preferences = await UserPreferences.findOne({ userId: req.params.userId });
    if (preferences) {
      preferences.columnColors = req.body.columnColors;
    } else {
      preferences = new UserPreferences({
        userId: req.params.userId,
        columnColors: req.body.columnColors
      });
    }
    await preferences.save();
    res.status(201).json(preferences);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
