import express from "express";
import { fetchData } from "../controllers/dataController.js"; // Corrected import
import { fetchData as fetchEdfData } from "../controllers/edfController.js";


const router = express.Router();

// Use the correctly imported function name
router.get("/enedis-data", fetchData);
router.get("/edf-data", fetchEdfData);

export default router;
