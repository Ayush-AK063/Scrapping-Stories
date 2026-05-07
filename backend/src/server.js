const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");
const { scrapeTopStories } = require("./services/scraperService");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  try {
    const stories = await scrapeTopStories();
    console.log(`Startup scrape completed: ${stories.length} stories saved`);
  } catch (error) {
    console.error("Startup scrape failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
