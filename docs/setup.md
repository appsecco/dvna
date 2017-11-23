# Setup

It is recommeded to follow the Dockerized setup of the application unless a manual setup is required

## Requirements

Dockerized Setup:

- Docker (Tested working on v1.13.1)
- Docker Compose (Tested working on v1.17.1)

Setup Without Docker:

- NodeJS (Deveoped using NodeJS v6.11.4)
- MySQL Server (Developed using MySQL 5.7)

## Decokerized setup

If you do not have Docker and Docker Compose setup, then

Install [Docker](https://docs.docker.com/engine/installation/) first and then 
[Docker Compose](https://docs.docker.com/compose/install/) on your system. Then follow the instructions below

1. Clone the respository
```bash
git clone https://github.com/appsecco/dvna; cd dvna
```
2. Create a file with name `vars.env` in the application's folder with the desired configuration like the example below
```
MYSQL_USER=dvna
MYSQL_DATABASE=dvna
MYSQL_PASSWORD=passw0rd
MYSQL_RANDOM_ROOT_PASSWORD=yes
```
3. Start the application using Docker Compose
```bash
docker-compose up
```

Access the application at http://localhost:9090 and start practicing!

The application will automatically reload on code changes, so feel free to patch and play around.

## Manual Setup

This is an advanced setup which requires you to have NodeJS setup on your system and access to a MySQL Database. Unless your requirements demands it, its recommended to go with the Dockerized Setup above.

If you do not have NodeJS on your system, then 
Install [NodeJS](https://nodejs.org/en/download/package-manager/) first.

If you do not have access to an existing MySQL server and would like to setup your own MySQL instance, then refer to this [Getting Started](https://dev.mysql.com/doc/mysql-getting-started/en/) guide. Once the MySQL Sever is setup, create a new database and user for DVNA. You will need to configure these in the environment variables before starting the application.

1. Clone the repository
```bash
git clone https://github.com/appsecco/dvna; cd dvna
```
2. Configure the environment variables with your database information. For Windows system, refer to the guide on [Setting up environment variables](http://www.dowdandassociates.com/blog/content/howto-set-an-environment-variable-in-windows-command-line-and-registry/)
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

Access the application at http://localhost:9090 and start practicing!