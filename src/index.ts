import express from "express";
import { config } from "./config/env";  

const app = express();
const PORT = config.port;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
