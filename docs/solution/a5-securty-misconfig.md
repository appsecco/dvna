# Security Misconfiguration

## Application sends Stack Trace

![secmis1](/resources/secmis1.png "Security Misconfiguration")
An invalid input `XD` triggers a stack trace in the calculator endpoint at

http://127.0.0.1:9090/app/calc

The application was running in `DEVELOPMENT` mode and due to lack of error handling, it sent the stack trace with internal file locations and other potentially sensitive information.

*/core/apphandler.js*
```
...
if(req.body.eqn){
    req.flash('result',mathjs.eval(req.body.eqn))
    res.render('app/calc')
...
```

Additionally the issue occurs due to insecure NodeJS configuration that shows stack staces.

**Solution**

This particular issue can be solved by using a try catch exception handling
```
try{
    result = mathjs.eval(req.body.eqn)
}catch (err){
    result = 'Invalid Equation'
}
```

But a bigger issue is the application running in development mode. Set **NODE_ENV** environment variable to `production`, this improves performance too!

**Fixes**

Implemented in the following files

- *core/appHandler.js*

## X-Powered-By header

![powered-by](/resources/powered-by.png "X-Powered-By")

The `X-Powered-By : Express` header is sent by default in every response and disabling this is a good way to prevent attackers from fingerprinting your application.

**Solution**

Disable it using  `app.disable('x-powered-by')` in express

**Fixes**

Implemented in the following files

- *server.js*

**Reference**
- https://expressjs.com/en/advanced/best-practice-security.html
- https://www.owasp.org/index.php/Top_10_2013-A5-Security_Misconfiguration
- https://blog.risingstack.com/node-js-security-checklist/