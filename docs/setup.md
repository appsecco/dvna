# Setup

### Requirements

Dockerized Setup:

- Docker (Tested working on v1.13.1)
- Docker Compose (Tested working on v1.17.1)

Setup Without Docker:

- NodeJS (Deveoped using NodeJS v6.11.4)
- MySQL Server (Developed using MySQL 5.7)

### Run using Docker:

1. Clone the respository
```bash
git clone https://github.com/appsecco/dvna; cd dvna
```
2. Create an .env file like the with desired database configuration
```
MYSQL_USER=dvna
MYSQL_DATABASE=dvna
MYSQL_PASSWORD=passw0rd
MYSQL_RANDOM_ROOT_PASSWORD=yes
```
3. Start using Docker Compose
```bash
docker-compose up
```

Access the application at http://localhost:9090

### Run without Docker

For this, you will need to create a new database on a MySQL Server and a user with write access on it

1. Clone the respository
```bash
git clone https://github.com/appsecco/dvna; cd dvna
```
2. Set the environment variables with your database information
```bash
export MYSQL_USER=dvna
export MYSQL_DATABASE=dvna
export MYSQL_PASSWORD=passw0rd
export MYSQL_HOST=127.0.0.1
export MYSQL_PORT=3306
```
3. Install Dependencies
```bash
npm install
```
4. Start the application
```bash
npm start
```

Access the application at http://localhost:9090