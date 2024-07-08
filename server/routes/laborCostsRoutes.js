import express from "express";
import { getLaborCostsByWorkerOrLocation } from '../controllers/laborCostsController.js';
import validateLaborCostInputs from '../validators/laborCostsValidator.js';

const laborRouter = express.Router();

laborRouter.get('/workers', validateLaborCostInputs, getLaborCostsByWorkerOrLocation);
laborRouter.get('/locations', validateLaborCostInputs, getLaborCostsByWorkerOrLocation);

export default laborRouter;