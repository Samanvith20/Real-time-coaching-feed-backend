import express from "express"
import { getFeeds, createFeed } from "../controllers/feedController.js"

const router = express.Router()

router.get("/", getFeeds)

router.post("/", createFeed)

export default router