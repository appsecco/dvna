module.exports = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST || 'mysql-db',
  port: process.env.MYSQL_PORT || 3306,
  dialect: 'mysql'
}