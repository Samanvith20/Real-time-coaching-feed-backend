import mongoose from "mongoose"

const feedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
)

export const Feed = mongoose.model("Feed", feedSchema)
