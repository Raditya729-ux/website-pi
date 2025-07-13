import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'radit',
  password: 'radit',
  database: 'pi_testing_tiga'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

export default db;
