import express from "express";
import config from "./config";

const app = express();
const PORT = config.port;

app.get("/", (req, res) => {
  res.send("Hello, Express World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
