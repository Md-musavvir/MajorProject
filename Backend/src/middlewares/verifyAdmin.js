import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const verifyAdmin = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(401, "Unauthorized access");
  }

  next();
});

export default verifyAdmin;
