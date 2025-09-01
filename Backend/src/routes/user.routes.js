import { Router } from "express";

import {
  addToCart,
  changePassword,
  loginUser,
  logoutUser,
  placeOrder,
  registerUser,
  removeFromCart,
  returnByCategory,
  ReturnCart,
} from "../controllers/user.controllers.js";
import verifyJwt from "../middlewares/verifyJwt.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.use(verifyJwt);
router.post("/logout", logoutUser);
router.get("/getBooks/:category", returnByCategory);
router.post("/addToCart", addToCart);
router.put("/removeFromCart", removeFromCart);
router.get("/getCart", ReturnCart);
router.put("/changePassword", changePassword);
router.post("/placeOrder", placeOrder);
export default router;
