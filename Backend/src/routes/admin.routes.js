import { Router } from "express";

import {
  addBook,
  getAllBooks,
  removeBook,
  returnByCategoryToAdmin,
  update_Book,
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyJwt from "../middlewares/verifyJwt.js";

const router = Router();
// Apply JWT verification to all routes first
router.use(verifyJwt, verifyAdmin);

// Routes
router.post("/addBook", upload.single("image"), addBook);
router.delete("/deleteBook/:id", removeBook);
router.put("/updateBook/:id", update_Book);

// Route with category param
router.get("/getBooks/:category", returnByCategoryToAdmin);

// Route to get all books
router.get("/getAllBooks", getAllBooks);

export default router;
