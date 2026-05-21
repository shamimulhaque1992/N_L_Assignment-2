import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import { issueRoute } from "./modules/issues/issue.route";
import { authRoute } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
    author: "Shamimul Haque",
  });
});

app.use("/api/issues", issueRoute);
app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
