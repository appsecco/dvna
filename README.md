# Damn Vulnerable NodeJS Application (DVNA) 

Damn Vulnerable NodeJS Application (DVNA) is a simple NodeJS application to demonstrate [**OWASP Top 10 Vulnerabilities**](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project#OWASP_Top_10_for_2013) and guide on fixing and avoiding these vulnerabilities

The application is powered by commonly used libraries such as [express](https://www.npmjs.com/package/express), [passport](https://www.npmjs.com/package/passport), [sequelize](https://www.npmjs.com/package/sequelize), etc.

A detailed guide on exploiting, fixing and avoiding OWASP Top 10 Vulnerabilities can be found at https://appsecco.github.io/dvna which will contain the following

1. How to exploit the vulnerability
2. Vulnerable code snippets and fixes
3. Recommendations on how to avoid such bugs
4. References for learning more

## Dockerized Setup

Clone this repository
```
git clone https://github.com/appsecco/dvna; cd dvna
```

Create a `.env` file like the with desired database configuration
```
MYSQL_USER=dvna
MYSQL_DATABASE=dvna
MYSQL_PASSWORD=passw0rd
MYSQL_RANDOM_ROOT_PASSWORD=yes
```

And run `docker-compose up` to start the application and database using docker.

## Manual Setup

For this, you will need to create a new database on a MySQL Server and a user with write access on it

Clone this repository
```
git clone https://github.com/appsecco/dvna; cd dvna
```

Set the environment variables with your database information 
```bash
export MYSQL_USER=dvna
export MYSQL_DATABASE=dvna
export MYSQL_PASSWORD=passw0rd
export MYSQL_HOST=127.0.0.1
export MYSQL_PORT=3306
```

Then run `npm install` to install the dependencies and `npm start` to start the application

## Thanks
[Abhisek Datta - abhisek](https://github.com/abhisek) for application architecture and front-end code

## License

MIT
