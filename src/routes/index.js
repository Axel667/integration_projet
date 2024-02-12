import express from "express";
import { fetchData } from "../controllers/dataController.js"; // Corrected import

const router = express.Router();

// Use the correctly imported function name
router.get("/enedis-data", fetchData);

export default router;
