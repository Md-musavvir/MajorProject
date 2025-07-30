import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    author: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "price cant be negative"],
    },
    category: {
      type: String,
      required: true,
      enum: ["fiction", "fantasy", "science", "non-fiction"],
      trim: true,
      lowercase: true,
    },
  },

  { timestamps: true }
);
export const Book = mongoose.model("Book", bookSchema);
