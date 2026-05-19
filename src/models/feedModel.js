import mongoose from "mongoose"

const feedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    image: {
      type: String,
      required: [true, "Image is required"],
    },

    author: {
      type: String,
      enum: ["Admin", "Mentor", "Coach"],
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
)

export const Feed = mongoose.model("Feed", feedSchema)  