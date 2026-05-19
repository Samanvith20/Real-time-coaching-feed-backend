import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

import cloudinary from "../config/cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "coaching-feed",

    public_id: `${Date.now()}-${file.originalname}`,
  }),
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        "Only JPG, PNG, JPEG, WEBP images are allowed"
      ),
      false
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
})

export default upload