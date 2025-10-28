const express = require('express');
const router = express.Router();

// placeholder route
router.get('/', (req, res) => {
  res.send('Gym dashboard route working!');
});

module.exports = router;