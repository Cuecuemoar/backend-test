import { calculateLaborCostsByWorkerOrLocation } from "../services/laborCostsService.js";
import {LOCATIONS_TYPE, WORKERS_ROUTE, WORKERS_TYPE} from '../constants.js';

const getLaborCostsByWorkerOrLocation = async (req, res) => {
    try {
        const { worker_ids, location_id, task_status } = req.query;
        const type = req.route.path === WORKERS_ROUTE ? WORKERS_TYPE : LOCATIONS_TYPE
        const costs = await calculateLaborCostsByWorkerOrLocation(worker_ids, location_id, task_status, type);
        res.json(costs);
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: 'A server error has occurred' });
    }
}

export {
    getLaborCostsByWorkerOrLocation
}