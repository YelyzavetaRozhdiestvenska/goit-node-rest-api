import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import contactsRouter from "./routes/contactsRouter.js";

const app = express();

const DB_HOST =
  "mongodb+srv://Yelyzaveta:MCx0exZAMKu6f2lB@cluster0.0y3dzxg.mongodb.net/db-contacts";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
    console.log("Server is running. Use our API on port: 3000");
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });
export default app;
