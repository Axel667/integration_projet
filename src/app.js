import express from "express";
import logger from "pino-http";
import indexRoute from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger({ level: process.env.NODE_ENV === "test" ? "error" : "info" }));
app.use("/", indexRoute);

export default app;
