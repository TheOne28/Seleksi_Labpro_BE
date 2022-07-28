import express from "express";
import { historyGetHandler } from "../controller/historyHandler";
import { authentication } from "../middleware/authMiddleware";

const router : express.Router = express.Router();

router.get("/", authentication,historyGetHandler);

module.exports = router;