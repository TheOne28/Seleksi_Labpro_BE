import express from "express";
import { loginHandler, registerHandler, verifyUserHandler } from "../controller/authentikasiHandler";
import { authentication } from "../middleware/authMiddleware";

const router : express.Router = express.Router();

router.get("/", loginHandler);
router.put("/", registerHandler);
router.patch("/", authentication, verifyUserHandler)

module.exports = router;