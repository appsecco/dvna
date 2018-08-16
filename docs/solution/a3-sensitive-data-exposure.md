# Sensitive Data Exposure

## Hashed Passwords Disclosed

![info-dis](/resources/info-dis.png "Password Hash Disclosed")

The Admin API endpoint at http://127.0.0.1:9090/app/admin/api/users sends the entire user object to the front end. Even if the application/page rendering this may not display the password, it's critical that only necessary information is sent instead of the entire object

**Vulnerable Code snippet**

*core/apphandler.js*
```
...
db.User.findAll({}).then(users => {
    res.status(200).json({
        success: true,
        users: users
    })
...
```


**Solution**

This particular error can be fixed by selecting for only the required attributes from the database

```
db.User.findAll({attributes: [ 'id' ,'name', 'email']},).then(users => {
    res.status(200).json({
        success: true,
        users: users
    })
```

**Fixes**

Implemented in the following files

- *core/appHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/7c28c2e007ac48badc604e52621c37bbb8da8fbd)

## Logging of sensitive information

![info-dis](/resources/info-dis2.png "Password Hash Disclosed")

By default, Sequelize logs every query using `console.log`, this could be a serious issue if these logs are stored to disk or worse, sent elsewhere for analytics or other purposes

**Solution**

To fix this issue, disable logging in Sequelize

```
// Sequelize connection
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host, 
    dialect: config.dialect, 
    logging: false
});
```

**Fixes**

Implemented in the following files

- *models/index.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/60ed581799f2257e1be2d8a7747014d6b3d123af)

**Recommendation**

- Always be wary of where all your data resides or is transmitted to
- Send only the minimum information which is essential, even if may not be used

**Reference**

- <https://www.owasp.org/index.php/Top_10_2013-A6-Sensitive_Data_Exposure>
- <https://stackoverflow.com/questions/28927836/prevent-sequelize-from-outputting-sql-to-the-console-on-execution-of-query>