import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
