import pool from '../database/database.js';
import { WORKERS_TYPE, ALLOWED_TASK_STATUSES } from "../constants.js";

const calculateLaborCostsByWorkerOrLocation = async (workerIds = '', locationIds = '', taskStatus = '', type) => {
    const connection = await pool.getConnection();

    try {
        let query = `
            SELECT ${type === WORKERS_TYPE ? 'workers.username' : 'locations.name'},
            ROUND(SUM(logged_time.time_seconds * workers.hourly_wage / 3600), 2) AS total_cost
            FROM logged_time
            JOIN workers ON logged_time.worker_id = workers.id
            JOIN tasks ON logged_time.task_id = tasks.id
            JOIN locations ON tasks.location_id = locations.id `;

        const conditions = [];
        const values = [];

        if (workerIds.length > 0) {
            conditions.push('workers.id IN (?)');
            const workers = workerIds.split(',')
            values.push(workers);
        }

        if (locationIds.length > 0) {
            conditions.push('locations.id IN (?)');
            const locations = locationIds.split(',')
            values.push(locations);
        }

        if (taskStatus.length > 0) {
            conditions.push(`tasks.is_complete = ?`)
            values.push(ALLOWED_TASK_STATUSES[taskStatus])
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` GROUP BY ${type === WORKERS_TYPE ? 'workers.username' : 'locations.name'}`;
        console.log(query)
        return await connection.query(query, values);
    } catch (e) {
        throw e;
    } finally {
        await connection.release();
    }
}

export {
    calculateLaborCostsByWorkerOrLocation
}