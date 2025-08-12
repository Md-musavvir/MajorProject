import { Book } from "../models/book.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const addBook = AsyncHandler(async (req, res) => {
  const { title, author, price, category } = req.body;
  if ([title, author, price, category].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All details are required");
  }
  const ExistBook = await Book.findOne({ title: title });
  if (ExistBook) {
    throw new ApiError(400, "Book Already exists");
  }
  const imagePath = req.file?.path;
  if (!imagePath) {
    throw new ApiError(400, "Image not recieved");
  }
  const image = await uploadOnCloudinary(imagePath);
  if (!image || (!image.url && !image.secure_url)) {
    console.log(image);
    throw new ApiError(500, "something went wrong while uploading the image");
  }
  const imageUrl = image?.url || image?.secure_url;
  const book = await Book.create({
    title,
    author,
    price,
    image: imageUrl,
    category,
  });
  const addedBook = await Book.findOne({ title: book.title });
  if (!addedBook) {
    throw new ApiError(500, "something went wrong while adding book");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, addedBook, "Book added successfully"));
});
export { addBook };
