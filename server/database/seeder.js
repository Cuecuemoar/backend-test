import pool from '../database/database.js';
import { faker } from '@faker-js/faker';

const connection = await pool.getConnection();

try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE logged_time');
    await connection.query('TRUNCATE TABLE workers');
    await connection.query('TRUNCATE TABLE tasks');
    await connection.query('TRUNCATE TABLE locations');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const locations = [];
    for (let i = 0; i < 20; i++) {
        const name = faker.location.city();
        const result = await connection.query('INSERT INTO locations (name) VALUES (?)', [name]);
        locations.push({ id: result.insertId, name });
    }

    const tasks = [];
    for (let i = 0; i < 100; i++) {
        const description = faker.lorem.sentence({min: 3, max: 7});
        const location_id = faker.helpers.arrayElement(locations).id;
        const is_complete = faker.number.int({min: 0, max: 1});
        const result = await connection.query(
            'INSERT INTO tasks (description, location_id, is_complete) VALUES (?, ?, ?)',
            [description, location_id, is_complete]);
        tasks.push({ id: result.insertId, description, location_id });
    }

    const workers = [];
    for (let i = 0; i < 50; i++) {
        const username = faker.internet.userName();
        const hourly_wage = faker.commerce.price({'min': 15, 'max': 50, 'dec': 2});
        const result = await connection.query(
            'INSERT INTO workers (username, hourly_wage) VALUES (?, ?)',
            [username, hourly_wage]);
        workers.push({ id: result.insertId, username, hourly_wage });
    }

    for (let i = 0; i < 500; i++) {
        const time_seconds = faker.number.int({ min: 60 * 3, max: 60 * 60 * 8 });
        const task_id = faker.helpers.arrayElement(tasks).id;
        const worker_id = faker.helpers.arrayElement(workers).id;
        await connection.query(
            'INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (?, ?, ?)',
            [time_seconds, task_id, worker_id]);
    }

    console.log('Database seeded successfully!');
} catch (error) {
    console.error('Error seeding database:', error);
} finally {
    await connection.release();
}
