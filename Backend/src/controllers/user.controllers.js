import { Book } from "../models/book.models.js";
import { Cart } from "../models/cart.models.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const generateTokens = async (id) => {
  const user = await User.findById(id);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = AsyncHandler(async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    console.log(req.body);

    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
      throw new ApiError(409, "user already exists");
    }
    const user = await User.create({ username, email, password });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(400, "something went wrong while registering user");
    }
    return res
      .status(200)
      .json(new ApiResponse(201, createdUser, "User registered succesfully"));
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "cant register user",
    });
  }
});
const loginUser = AsyncHandler(async (req, res) => {
  //get data from user
  //username or email
  //find user
  //password check
  //access and refresh token
  //send cookies
  const { username, email, password } = req.body;
  if (!(username || email) || !password) {
    throw new ApiError(400, "credentials are required");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "user doesnt exits");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect Password");
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});
const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});
const changePassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log(req.body);

  if (!(oldPassword && newPassword)) {
    throw new ApiError(400, "Passwords are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});
const returnByCategory = AsyncHandler(async (req, res) => {
  const { category } = req.params;
  if (!category) {
    throw new ApiError(400, "category is required for fetching");
  }
  const books = await Book.find({ category }).sort({ createdAt: -1 });
  if (books.length === 0) {
    throw new ApiError(404, "no books in this category is found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        books,
        "books fetched successfully for this category"
      )
    );
});
const addToCart = AsyncHandler(async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) {
    throw new ApiError(400, "Book id is required");
  }
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ book: bookId, quantity: 1 }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.book.toString() === bookId
    );
    if (!existingItem) {
      cart.items.push({ book: bookId, quantity: 1 });
    } else {
      existingItem.quantity += 1;
    }
    await cart.save();
  }
  const populatedCart = await Cart.findById(cart._id).populate(
    "items.book",
    "title author price"
  );
  let grandTotal = 0;
  const response = populatedCart.items.map((item) => {
    const itemTotal = item.quantity * item.book.price;
    grandTotal += itemTotal;
    return {
      bookId: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      quantity: item.quantity,
      totalPrice: itemTotal,
    };
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: response, grandTotal },
        "here is the cart detail"
      )
    );
});

export {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  returnByCategory,
};
