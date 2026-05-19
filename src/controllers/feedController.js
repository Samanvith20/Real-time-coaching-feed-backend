import {Feed} from "../models/feedModel.js"
import redis from "../config/redis.js"


// GET FEEDS
const getFeeds = async (req, res) => {
  try {
    // 1. Check cache first
    const cachedFeeds = await redis.get("feeds")

    if (cachedFeeds) {

      console.log("Serving from Redis cache",)
      

      return res.status(200).json({
        success: true,
        source: "redis-cache",
        feeds:
      typeof cachedFeeds === "string"
        ? JSON.parse(cachedFeeds)
        : cachedFeeds,
      })
    }

    // 2. If no cache → fetch DB
    const feeds = await Feed.find().sort({ createdAt: -1 })

    // 3. Store in Redis
   await redis.set("feeds", JSON.stringify(feeds))

    console.log("Serving from MongoDB")

    res.status(200).json({
      success: true,
      source: "mongodb",
      feeds,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch feeds",
    })
  }
}

// CREATE FEED
const createFeed = async (req, res) => {
  try {
    const { title, description, image, author } = req.body

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description required",
      })
    }

    // Save to DB
    const newFeed = await Feed.create({
      title,
      description,
      image,
      author,
    })

    // Invalidate cache
    await redis.del("feeds")

    // Emit realtime event
    req.io.emit("new-feed", newFeed)

    res.status(201).json({
      success: true,
      message: "Feed created",
      feed: newFeed,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to create feed",
    })
  }
}


export  {
  getFeeds,
  createFeed,
}