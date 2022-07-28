import express from "express";
import { profileGetHandler } from "../controller/profileHandler";
import { authentication } from "../middleware/authMiddleware";

const router : express.Router = express.Router();

//get customer data
router.get("/:username", authentication, profileGetHandler);

router.patch("/");

export default router;