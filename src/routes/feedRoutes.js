import express from "express"
import { getFeeds, createFeed } from "../controllers/feedController.js"
import upload from "../middlewares/uploadMiddleware.js"

const router = express.Router()

router.get("/", getFeeds)

router.post(
  "/",
  upload.single("image"),
  createFeed
)

export default router