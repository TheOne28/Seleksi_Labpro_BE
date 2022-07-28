import express from "express";
import { profileGetHandler, profilePatchHandler } from "../controller/profileHandler";
import { authentication } from "../middleware/authMiddleware";

const router : express.Router = express.Router();

// * get customer data
router.get("/" , authentication, profileGetHandler);

// * Update customer profile (own profile)
router.patch("/", authentication, profilePatchHandler);

module.exports = router;