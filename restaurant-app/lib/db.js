import { Pool } from "pg";

// Dùng global để tránh tạo quá nhiều connection pool khi Next.js reload code lúc dev
let pool = global._pgPool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Neon yêu cầu SSL
  });
  global._pgPool = pool;
}

export default pool;
