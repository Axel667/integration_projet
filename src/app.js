import express from "express";
import logger from "pino-http";
import indexRoute from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

// Initialize the app before using it
const app = express();

// Other imports and middleware...
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Now you can safely use `app` because it has been initialized
app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger({ level: process.env.NODE_ENV === "test" ? "error" : "info" }));

app.use("/", indexRoute);

export default app;
