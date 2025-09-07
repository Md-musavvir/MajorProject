import { Book } from "../models/book.models.js";
import { Cart } from "../models/cart.models.js";
import { Order } from "../models/order.models.js";
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
      throw new ApiError(500, "something went wrong while registering user");
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
  // email
  //find user
  //password check
  //access and refresh token
  //send cookies
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    throw new ApiError(400, "credentials are required");
  }
  const user = await User.findOne({ email });
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
  return res
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
const returnUserData = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  if (!userId) {
    throw new ApiError(404, "no user id is provided");
  }
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "user doesnt exist");
  }
  res.status(200).json(new ApiResponse(200, user, "here is user data"));
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
  console.log(bookId);
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
const removeFromCart = AsyncHandler(async (req, res) => {
  const { bookId } = req.body;
  if (!bookId) {
    throw new ApiError(400, "Items id is required");
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, "Cart doesnt exist");
  }
  const itemExist = cart.items.some((item) => item.book.toString() === bookId);
  if (!itemExist) {
    throw new ApiError(400, "Item doesnt exist in cart");
  }

  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  await cart.save();
  const populatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.book",
    "title author price"
  );
  let grandTotal = 0;
  const newCart = populatedCart.items.map((item) => {
    const total = item.quantity * item.book.price;
    grandTotal += total;
    return {
      bookId: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      quantity: item.quantity,
      totalPrice: total,
    };
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { items: newCart, grandTotal },
        "Item removed sucessfully"
      )
    );
});
const updatingQuantity = AsyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { action } = req.body;
  if (!bookId || !action) {
    throw new ApiError(400, "Item details ar required");
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, "Cart doesnt exists");
  }
  const existingItem = cart.items.find(
    (item) => item.book.toString() === bookId
  );
  if (!existingItem) {
    throw new ApiError(404, "Item doesnt exist");
  }
  if (action === "increment") {
    existingItem.quantity += 1;
  } else if (action === "decrement" && existingItem.quantity > 1) {
    existingItem.quantity -= 1;
  } else {
    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  }
  await cart.save();
  const populatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.book",
    "title author price"
  );
  let grandTotal = 0;
  const newCart = populatedCart.items.map((item) => {
    const total = item.quantity * item.book.price;
    grandTotal += total;
    return {
      bookId: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      quantity: item.quantity,
      totalPrice: total,
    };
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { item: newCart, grandTotal },
        `item quantity has been successfully ${action}ed`
      )
    );
});
const returnSearch = AsyncHandler(async (req, res) => {
  const { title } = req.query;

  if (!title) {
    throw new ApiError(400, "title is required");
  }

  const books = await Book.find({
    title: { $regex: title, $options: "i" },
  });

  if (!books || books.length === 0) {
    throw new ApiError(404, "no books found");
  }

  res.status(200).json(new ApiResponse(200, books, "matching books found"));
});
const returnBookById = AsyncHandler(async (req, res) => {
  const { bookId } = req.params;
  console.log("in the controller");
  console.log(bookId);
  if (!bookId) {
    throw new ApiError(404, "book id not recieved");
  }
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "book not found");
  }
  res.status(200).json(new ApiResponse(200, book, "required book"));
});

const ReturnCart = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "user id nor recieved");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const populatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.book",
    "title author price"
  );
  let grandTotal = 0;
  const newCart = populatedCart.items.map((item) => {
    const total = item.quantity * item.book.price;
    grandTotal += total;
    return {
      bookId: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      quantity: item.quantity,
      totalPrice: total,
    };
  });

  res
    .status(200)
    .json(new ApiResponse(200, { item: newCart, grandTotal }, "cart data"));
});
const returnOrders = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "user id doesnt exists");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const order = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("items.book", "title price author");
  if (!order || order.length === 0) {
    throw new ApiError(404, "No orders found for this user");
  }

  res.status(200).json(new ApiResponse(200, order, "here is your orders"));
});

const placeOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized: user not found"));
    }

    const { items, total, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json(new ApiResponse(400, null, "Cart is empty"));
    }
    if (!address) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Address is required"));
    }
    if (!paymentMethod) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Payment method is required"));
    }

    const order = new Order({
      user: userId,
      items: items.map((i) => ({ book: i.book, quantity: i.quantity })),
      total,
      address,
      paymentMethod,
    });

    await order.save();

    await User.findByIdAndUpdate(userId, { cart: [] });

    res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } catch (err) {
    console.error("Error in placeOrder:", err);
    res
      .status(500)
      .json(new ApiResponse(500, null, "Server error: " + err.message));
  }
};

export {
  addToCart,
  changePassword,
  loginUser,
  logoutUser,
  placeOrder,
  registerUser,
  removeFromCart,
  returnBookById,
  returnByCategory,
  ReturnCart,
  returnOrders,
  returnSearch,
  returnUserData,
  updatingQuantity,
};
