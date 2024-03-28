import express from "express";
import { fetchData } from "../controllers/dataController.js"; // Corrected import
import { fetchData as fetchEdfData } from "../controllers/edfController.js";


const router = express.Router();

// Use the correctly imported function name
router.get("/enedis-data", fetchData);
router.get("/edf-data", fetchEdfData);
/*
router.get("/edf-data", (req, res) => {
  // Send a 500 Internal Server Error for testing purposes
  res.status(500).json({ message: "Internal Server Error" });
});
///
*/
export default router;
