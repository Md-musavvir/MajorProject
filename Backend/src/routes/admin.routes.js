import { Router } from "express";

import { addBook } from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.js";

const router = Router();
router.post("/addBook", upload.single("image"), addBook);
export default router;
