import { Router } from "express";

import {
  addBook,
  getAllBooks,
  removeBook,
  update_Book,
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyJwt from "../middlewares/verifyJwt.js";

const router = Router();
router.use(verifyJwt, verifyAdmin);
router.post("/addBook", upload.single("image"), addBook);
router.delete("/deleteBook/:id", removeBook);
router.put("/updateBook/:id", update_Book);
router.get("/getAllBooks", getAllBooks);

export default router;
