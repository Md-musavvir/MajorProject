import { Router } from "express";

import {
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  returnByCategory,
} from "../controllers/user.controllers.js";
import verifyJwt from "../middlewares/verifyJwt.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.use(verifyJwt);
router.post("/logout", logoutUser);
router.get("/getBooks/:category", returnByCategory);

router.put("/changePassword", changePassword);
export default router;
