import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../index.js'
import {calculateDiscrepancy, sumCosts} from "../utils/helpers.js";

describe('GET /labor-costs', () => {
    test('/workers base case should return 200 and 50 or fewer workers', async () => {
        const response = await request(app).get('/labor-costs/workers');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.length).toBeLessThanOrEqual(50);
    });

    test('Test a good response with all query parameters', async () => {
        const response = await request(app).get('/labor-costs/workers?worker_ids=1,2,3,4,5,6,7,8,9&location_id=3,4,5&task_status=complete');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    test('/locations base case should return 200 and 20 or fewer locations', async () => {
        const response = await request(app).get('/labor-costs/locations');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.length).toBeLessThanOrEqual(20);
    });

    test('/locations should fail when a malformed ID is provided in query string', async () => {
        const response = await request(app).get('/labor-costs/locations?worker_ids=1,2asdf,3');
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('worker_ids must be an integer or a comma-separated list of integers greater than 0');
    });

    test('Validate grouping logic by checking that total of totals is the same for both endpoints within a small margin' +
        ' of error to account for rounding errors', async () => {
        const {body: workersResponse} = await request(app).get('/labor-costs/workers');
        const {body: locationsResponse} = await request(app).get('/labor-costs/locations');

        const workersTotal = sumCosts(workersResponse)
        const locationsTotal = sumCosts(locationsResponse)

        expect(calculateDiscrepancy(workersTotal, locationsTotal)).toBeLessThan(.00001)
    });

    test('Validate (in)complete task status logic by verifying that the total of (in)complete tasks is the same' +
        ' as the total of all tasks within a small margin of error to account for rounding errors', async () => {
        const {body: allTasks} = await request(app).get('/labor-costs/workers');
        const {body: completeTasks} = await request(app).get('/labor-costs/workers?task_status=complete');
        const {body: incompleteTasks} = await request(app).get('/labor-costs/workers?task_status=incomplete');

        const allTasksTotal = sumCosts(allTasks);
        const completeTasksTotal = sumCosts(completeTasks);
        const incompleteTasksTotal = sumCosts(incompleteTasks);

        expect(calculateDiscrepancy(allTasksTotal, completeTasksTotal + incompleteTasksTotal)).toBeLessThan(.00001)
    });

});
