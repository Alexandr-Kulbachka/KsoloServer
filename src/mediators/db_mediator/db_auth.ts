require('dotenv').config();

const { Pool } = require('pg');
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
const pool = new Pool({
    connectionString: process.env.DEBUG_MODE ? connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});


export default pool;