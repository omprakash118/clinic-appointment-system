import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString : process.env.PG_URL,
    ssl : {
        rejectUnauthorized : false,
    },
});

const connectPostDB = async () => {
    try {
        await pool.connect();
        console.log("✅ PostgreSQL connected successfully");
    } catch (error) {
        console.error('❌ PostgreSQL Connection Failed -', error);
        process.exit(1);
    }
}

// module.exports = { connectPostDB , pool };

export default connectPostDB;