const router = require("express").Router();
const { favShows, favMovies } = require("../db");
const checkAuth = require("../middleware/checkAuth");

router.get("/public", (req, res) => {
  res.json(favShows);
});

router.get("/private", checkAuth, (req, res) => {
  res.json(favMovies);
});

module.exports = router;
