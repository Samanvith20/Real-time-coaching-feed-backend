import {Feed} from "../models/feedModel.js"
import redis from "../config/redis.js"
import logger from "../config/logger.js"


// GET FEEDS
const getFeeds = async (req, res) => {
  try {
    // 1. Check cache first
    const cachedFeeds = await redis.get("feeds")

    if (cachedFeeds) {

      logger.info("Serving from Redis cache")

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

    logger.info("Serving from MongoDB")

    res.status(200).json({
      success: true,
      source: "mongodb",
      feeds,
    })
  } catch (error) {
    logger.error("Error fetching feeds:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch feeds",
    })
  }
}

// CREATE FEED
const createFeed = async (req, res) => {
  try {
    

    const title = req.body.title?.trim()
    const description = req.body.description?.trim()
    const author = req.body.author?.trim() || undefined

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image upload required",
      })
    }

    const image = req.file?.path

    if (!title || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      })
    }

    const newFeed = await Feed.create({
      title,
      description,
      image,
      author,
    })

    logger.info("New feed created:", JSON.stringify(newFeed._id))

    await redis.del("feeds")

    req.io.emit("new-feed", newFeed)

    res.status(201).json({
      success: true,
      feed: newFeed,
    })
  } catch (error) {
    logger.error("Error creating feed:", error) 
    

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