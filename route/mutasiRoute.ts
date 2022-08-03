import express from "express";
import { addMutasiHandler, addTransferHandler, verifikasiPendapatanHandler } from "../controller/mutasiHandler";
import { authentication } from "../middleware/authMiddleware";

const router : express.Router = express.Router();

router.patch("/", authentication, verifikasiPendapatanHandler);
router.post("/mutasi", authentication, addMutasiHandler);
router.post("/transfer", authentication, addTransferHandler)

module.exports = router;