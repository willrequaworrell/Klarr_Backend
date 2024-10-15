const express = require('express');
const router = express.Router();

// Test backend running
router.get('/', async (req, res) => {
    try {
      res.json({"message": "hello world"})
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  module.exports = router;