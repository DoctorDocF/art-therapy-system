const express = require('express');
const router = express.Router();

router.get('/patients', (req, res) => {
  res.json({ message: "API работает" });
});

module.exports = router;