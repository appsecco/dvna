# Injection

## SQL Injection

There is a SQL Injection in `User Search` feature at the following URL  

http://127.0.0.1:9090/app/usersearch

By injecting a single quote `'`, we see an error has occurred.
![sqli1](/resources/sqli1.png "SQLi Trigger")

An attacker can exploit this further and obtain potentially sensitive information from the database by supplying the input `' UNION SELECT password,1 from Users where login='user' -- //`
![sqli2](/resources/sqli2.png "Exploiting SQLi")

**Vulnerable Code snippet**

*core/appHandler.js*
```         
...
var query = "SELECT name FROM Users WHERE login='" + req.body.login + "'";
db.sequelize.query(query,{ model: db.User }).then(user => {
    if(user.length){
...
```
**Solution**

You may use model's **find** function and rely on in-built input sanitization of sequelize

*core/appHandler.js*
```
...
if (vh.vCode(req.body.login)){
    db.User.find({where:{'login':req.body.login}}).then(user => {
        if (user) {
...
```

But it is recommended to explicitly validate/sanitize inputs

**Fixes**

Implemented in the following files

- *core/appHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/dc1f9c54685eb04f55e444370d6d622834e4cc00)

**Recommendation**

- Validate Input before processing
- Sanitize Input before storing

## Command Injection

There is a Command Injection in `Connectivity Test` feature at the following URL

http://127.0.0.1:9090/app/ping


By injecting `x ; id`, we are able to see that the `id` command has been executed.
![ci1](/resources/ci1.png "Command injection")

**Vulnerable Code snippet**

*core/appHandler.js*
```
const exec = require('child_process').exec;
...
exec('ping -c 2 '+ req.body.address, function(err,stdout,stderr){
    console.log(err)
    output = stdout + stderr
...
```
**Solution**

You may use `exec_file` or `spawn` method under child_process which will prevent arbitrary command execution.

*core/appHandler.js*
```
const execFile = require('child_process').execFile;
...
if (vh.vIP(req.body.address)){
    execFile('ping', ['-c', '2', req.body.address] , function(err,stdout,stderr){
    output = stdout + stderr
...
```

**Fixes**

Implemented in the following files

- *core/appHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/4fe36fcfbd615fc9ea340e1238be33dd0d140ef8)

**Recommendation**

- Use exec_file or spawn method instead
- Always Validate/Sanitize Input before processing. Look at [validator](https://www.npmjs.com/package/validator)
- Run commands in a sandbox/ isolated environment if possible
- Use a restricted user for running the process

**Reference**

- <https://www.owasp.org/index.php/Top_10-2017_A1-Injection>
- <https://snyk.io/blog/sql-injection-orm-vulnerabilities/>
- <https://hackernoon.com/nodejs-security-issue-javascript-node-example-tutorial-vulnerabilities-hack-line-url-command-injection-412011924d1b>