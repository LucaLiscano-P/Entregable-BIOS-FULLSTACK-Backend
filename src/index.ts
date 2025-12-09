import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { authRoutes } from "./routes/auth.routes";
import { connectDB } from "./config/db";
import { postRoutes } from "./routes/post.routes";
import { categoryRoute } from "./routes/category.routes";
import { adminRouter } from "./routes/admin.routes";


const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes); // Added auth routes
app.use("/posts", postRoutes); // Added post routes
app.use("/categories", categoryRoute); // Added category routes
app.use("/admin", adminRouter); // Added admin routes

const startServer = async () => {
  await connectDB(); // Connect to the database
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startServer();
