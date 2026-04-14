import mysql from 'mysql2/promise';

// MySQL 连接配置
const pool = mysql.createPool({
  host: '162.14.67.232',
  port: 3306,
  user: 'gen_data',
  password: '940723@Wen',
  database: 'gen_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;