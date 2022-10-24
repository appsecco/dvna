# Damn Vulnerable NodeJS Application (DVNA)

![dvna-logo](docs/resources/dvna.png)

Damn Vulnerable NodeJS Application (DVNA) is a simple NodeJS application to demonstrate [**OWASP Top 10 Vulnerabilities**](https://www.owasp.org/index.php/Top_10-2017_Top_10) and guide on fixing and avoiding these vulnerabilities. The [fixes](https://github.com/appsecco/dvna/tree/fixes) branch will contain fixes for the vulnerabilities. Fixes for vunerabilities OWASP Top 10 2017 vulnerabilities at [fixes-2017](https://github.com/appsecco/dvna/tree/fixes-2017) branch.

The application is powered by commonly used libraries such as [express](https://www.npmjs.com/package/express), [passport](https://www.npmjs.com/package/passport), [sequelize](https://www.npmjs.com/package/sequelize), etc.

### Setup

Clone this repository

```bash
git clone https://github.com/WildCodeSchool/dvna; cd dvna
```

Start the application and database using docker-compose

```bash
docker-compose up
```

Access the application at http://127.0.0.1:9090/

The application will automatically reload on code changes, so feel free to patch and play around with the application.

## Contributing

In case of bugs in the application, please create an issue on github. Pull requests are highly welcome!

## Thanks

[Abhisek Datta - abhisek](https://github.com/abhisek) for application architecture and front-end code

## License

MIT
