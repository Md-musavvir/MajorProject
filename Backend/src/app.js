import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://major-project-beige-beta.vercel.app",
    ],
    credentials: true,
  }),
);

app.options("*", cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

export default app;
