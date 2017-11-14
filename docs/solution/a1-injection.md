# Injection

## SQL Injection

There is a SQL Injection in `User Search` feature at the following URL  

http://127.0.0.1:9090/app/usersearch


By injecting a single quote `'`, we see an error has occurred.
![sqli1](/resources/sqli1.png "SQLi Trigger")

An attacker can exploit this further and obtain potentially sensitive information from the database
![sqli2](/resources/sqli2.png "Exploiting SQLi")

**Vulnerable Code snippet**

*core/apphandler.js*
```         
...
var query = "SELECT name FROM Users WHERE login='" + req.body.login + "'";
db.sequelize.query(query,{ model: db.User }).then(user => {
    if(user.length){
...
```
**Solution**

You may use model's **find** function and rely on in-built input sanitization of sequelize
```
...
db.Users.find({where:{login:req.body.login}}).then(user => {
    if(user){
...
```

But it is recommended to explicitly validate/sanitize inputs

**Recommendation**

- Validate Input before processing
- Sanitize Input before storing

Never trust the user, using a library like [validatorjs](https://www.npmjs.com/package/validator) may help.

## Command Injection

There is a Command Injection in `Connectivity Test` feature at the following URL

http://127.0.0.1:9090/app/ping


By injecting `x ; id`, we are able to see that the `id` command has been executed.
![ci1](/resources/ci1.png "Command injection")

**Vulnerable Code snippet**

*core/apphandler.js*
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
```
const execFile = require('child_process').execFile;
...
execFile('ping', ['-c', '2', req.body.address] , function(err,stdout,stderr){
    console.log(err)
    output = stdout + stderr
...
```


**Recommendation**

- Use exec_file or spawn method instead
- Always Validate/Sanitize Input before processing. Look at [validator](https://www.npmjs.com/package/validator)
- Run commands in a sandbox/ isolated environment if possible
- Use a restricted user for running the process

**Reference**

- https://www.owasp.org/index.php/Top_10_2013-A1-Injection
- https://snyk.io/blog/sql-injection-orm-vulnerabilities/
- https://hackernoon.com/nodejs-security-issue-javascript-node-example-tutorial-vulnerabilities-hack-line-url-command-injection-412011924d1b