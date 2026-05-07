const express = require("express");
const { triggerScrape } = require("../controllers/scrapeController");

const router = express.Router();

router.post("/", triggerScrape);

module.exports = router;
