import { query, validationResult } from  'express-validator';
import { ALLOWED_TASK_STATUSES } from "../constants.js";

const taskStatusNames = Object.keys(ALLOWED_TASK_STATUSES)

const validateIds = (field) => [
    query(field)
        .optional()
        .custom((value) => {
            if (typeof value === 'string') {
                const ids = value.split(',');
                return ids.every((id) => /^\d+$/.test(id) && parseInt(id, 10) > 0);
            }
            return /^\d+$/.test(value) && parseInt(value, 10) > 0;
        })
        .withMessage(`${field} must be an integer or a comma-separated list of integers greater than 0`),
];

const validateCompleted = (field) => [
    query(field)
        .optional()
        .custom((value) => taskStatusNames.includes(value))
        .withMessage(`${field} must be one of: ${taskStatusNames.join(', ')}`)
];

const validateLaborCostInputs = [
    ...validateIds('worker_ids'),
    ...validateIds('location_id'),
    ...validateCompleted('task_status'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export default validateLaborCostInputs;