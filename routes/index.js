const router = require('express').Router();
const apiRoutes = require('./api');

// routes all /api requests to the /api folder
router.use('/api', apiRoutes);

// Any non /api requests will be sent a message
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;