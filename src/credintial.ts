import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'kezanat_db',
  password: '',
  port: 2025
});

export default client;
