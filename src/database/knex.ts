import knex from 'knex';
import knexConfig from '../config/knexfile';
import { Model } from 'objection'; 

const db = knex(knexConfig);
Model.knex(db);

export default db;
