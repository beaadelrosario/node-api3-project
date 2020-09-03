const express = require('express');
const postDb = require("./postDb");

const router = express.Router();

router.get('/', validatePostId, (req, res) => {
  res.status(200).json({ message: "success" });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: "success" });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: "success" });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: "success" });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  console.log("middleware hit!")
  next();
}

module.exports = router;
