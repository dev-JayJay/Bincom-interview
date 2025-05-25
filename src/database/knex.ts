import knex from 'knex';
import knexConfig from '../config/knexfile';

const db = knex(knexConfig);

export default db;
