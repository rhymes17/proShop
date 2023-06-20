import path from "path";
import express from "express";
import colors from "colors";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import productRoute from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const PORT = process.env.PORT || 5000;

//Initialise the app
const app = express();

// app.use(cors);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parse
app.use(cookieParser());

//connect DB
connectDB();

//routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({
    clientId: process.env.PAYPAL_CLIENT_ID,
  })
);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use("/uploads", express.static("/var/data/uploads"));
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  const __dirname = path.resolve();
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

//listen at port
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
