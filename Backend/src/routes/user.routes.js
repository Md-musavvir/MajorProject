import { Router } from 'express';

import {
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
} from '../controllers/user.controllers.js';
import verifyJwt from '../middlewares/verifyJwt.js';

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getBook", returnSearch);
router.get("/fetchBook/:bookId", returnBookById);
router.get("/getBooks/:category", returnByCategory);
router.use(verifyJwt);
router.post("/logout", logoutUser);
router.post("/addToCart", addToCart);
router.put("/removeFromCart", removeFromCart);
router.get("/getCart", ReturnCart);
router.put("/changePassword", changePassword);
router.post("/placeOrder", placeOrder);
router.get("/userData", returnUserData);
router.get("/getOrders", returnOrders);

export default router;
