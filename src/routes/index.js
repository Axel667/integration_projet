import express from "express";
import { fetchData as fetchEnedisData } from "../controllers/dataController.js";
import { fetchData as fetchEdfData } from "../controllers/edfController.js";

const router = express.Router();

// Route pour les données Enedis
router.get("/enedis-data", fetchEnedisData);


// Route pour les données EDF
router.get("/edf-data", fetchEdfData);


export default router;

