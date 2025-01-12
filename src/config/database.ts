import knex from 'knex';
import { config } from './config';

const db = knex({
    client: 'pg',
    connection: {
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name
    }
});

export default db;