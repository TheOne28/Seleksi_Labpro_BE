import express from "express";
import { addMutasiHandler, addTransferHandler, verifikasiPendapatanHandler } from "../controller/mutasiHandler";
import { authentication } from "../middleware/authMiddleware";

const router : express.Router = express.Router();

router.patch("/", authentication, verifikasiPendapatanHandler);
router.put("/mutasi", authentication, addMutasiHandler);
router.put("/transfer", authentication, addTransferHandler)

module.exports = router;