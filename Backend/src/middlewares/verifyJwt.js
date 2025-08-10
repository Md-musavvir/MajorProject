import jwt from "jsonwebtoken";

import { User } from "../models/user.models";
import ApiError from "../utils/ApiError";
import AsyncHandler from "../utils/AsyncHandler";

const verifyJwt = AsyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) {
      throw new ApiError(403, "Token not found");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(400, "user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "invalid AccessToken");
  }
});
export default verifyJwt;
