const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const HN_URL = "https://news.ycombinator.com";

const parseAgeToDate = (ageText) => {
  if (!ageText) return new Date();

  const match = ageText.match(/(\d+)\s+(minute|minutes|hour|hours|day|days)/i);
  if (!match) return new Date();

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const now = Date.now();

  if (unit.startsWith("minute")) return new Date(now - value * 60 * 1000);
  if (unit.startsWith("hour")) return new Date(now - value * 60 * 60 * 1000);
  if (unit.startsWith("day")) return new Date(now - value * 24 * 60 * 60 * 1000);

  return new Date();
};

const scrapeTopStories = async () => {
  const response = await axios.get(HN_URL);
  const $ = cheerio.load(response.data);

  const rows = $(".athing").slice(0, 10);
  const stories = [];

  rows.each((index, element) => {
    const row = $(element);
    const hnId = row.attr("id");
    const titleElement = row.find(".titleline a").first();
    const title = titleElement.text().trim();
    const href = titleElement.attr("href") || "";
    const url = href.startsWith("item?id=") ? `${HN_URL}/${href}` : href;

    const subtextRow = row.next();
    const pointsText = subtextRow.find(".score").text().trim();
    const points = Number(pointsText.replace(" points", "")) || 0;
    const author = subtextRow.find(".hnuser").text().trim() || "unknown";
    const ageText = subtextRow.find(".age").text().trim();
    const postedAt = parseAgeToDate(ageText);

    if (!hnId || !title) return;

    stories.push({
      hnId,
      title,
      url,
      points,
      author,
      postedAt,
    });

    return index;
  });

  const savedStories = await Promise.all(
    stories.map(async (story) =>
      Story.findOneAndUpdate({ hnId: story.hnId }, story, {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      })
    )
  );

  return savedStories;
};

module.exports = { scrapeTopStories };
