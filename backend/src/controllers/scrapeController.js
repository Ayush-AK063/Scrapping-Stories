const { scrapeTopStories } = require("../services/scraperService");
const asyncHandler = require("../utils/asyncHandler");

const triggerScrape = asyncHandler(async (req, res) => {
  const stories = await scrapeTopStories();
  return res.status(200).json({
    message: "Scrape completed successfully",
    count: stories.length,
    stories,
  });
});

module.exports = { triggerScrape };
