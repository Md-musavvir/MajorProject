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
export { changePassword, loginUser, logoutUser, registerUser };
