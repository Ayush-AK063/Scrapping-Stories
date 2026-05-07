const mongoose = require("mongoose");
const Story = require("../models/Story");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const getStories = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const [stories, total] = await Promise.all([
    Story.find().sort({ points: -1 }).skip(skip).limit(limit),
    Story.countDocuments(),
  ]);

  return res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    stories,
  });
});

const getBookmarkedStories = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;
  const userId = req.user._id;

  const query = { bookmarkedBy: userId };
  const [stories, total] = await Promise.all([
    Story.find(query).sort({ points: -1 }).skip(skip).limit(limit),
    Story.countDocuments(query),
  ]);

  return res.status(200).json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    stories,
  });
});

const getStoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid story id", 400);
  }

  const story = await Story.findById(id);
  if (!story) {
    throw new AppError("Story not found", 404);
  }

  return res.status(200).json(story);
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid story id", 400);
  }

  const story = await Story.findById(id);
  if (!story) {
    throw new AppError("Story not found", 404);
  }

  const existingIndex = story.bookmarkedBy.findIndex(
    (bookmarkUserId) => bookmarkUserId.toString() === userId
  );

  let action = "bookmarked";
  if (existingIndex >= 0) {
    story.bookmarkedBy.splice(existingIndex, 1);
    action = "unbookmarked";
  } else {
    story.bookmarkedBy.push(userId);
  }

  await story.save();

  return res.status(200).json({
    message: `Story ${action} successfully`,
    isBookmarked: action === "bookmarked",
    story,
  });
});

module.exports = {
  getStories,
  getBookmarkedStories,
  getStoryById,
  toggleBookmark,
};
