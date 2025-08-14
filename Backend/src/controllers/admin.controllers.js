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
const removeBook = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "item id is required ");
  }
  const item = await Book.findById(id);
  if (!item) {
    throw new ApiError(404, "no item is found");
  }
  const deleted_book = await Book.findByIdAndDelete(id);
  if (!deleted_book) {
    throw new ApiError(500, "something went wrong while deleting the item");
  }
  res.status(200).json(new ApiResponse(200, {}, "item deleted successfully"));
});
const update_Book = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, price, category } = req.body;
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, "item not found");
  }
  if (
    title === undefined &&
    price === undefined &&
    category === undefined &&
    author === undefined
  ) {
    throw new ApiError(400, "atleast one field is required to update");
  }
  const updated_data = {};
  if (title !== undefined) updated_data.title = title;
  if (price !== undefined) updated_data.price = price;
  if (category !== undefined) updated_data.category = category;
  if (author !== undefined) updated_data.author = author;
  const updated_item = await Book.findByIdAndUpdate(
    { _id: id },
    { $set: updated_data },
    { new: true, runValidators: true, context: "query" }
  );
  if (!updated_item) {
    throw new ApiError(500, "something went wrong while updating the item");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updated_item, "item updated successfully"));
});
const getAllBooks = AsyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  if (books.length === 0) {
    throw new ApiError(404, "no books were found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, books, "All books fetched successfully"));
});
export { addBook, getAllBooks, removeBook, update_Book };
