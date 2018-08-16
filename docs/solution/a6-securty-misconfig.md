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

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/9b17e5ae55a6bf0ec8ba41c25956c26e6e62badd)

## X-Powered-By header

![powered-by](/resources/powered-by.png "X-Powered-By")

The `X-Powered-By : Express` header is sent by default in every response and disabling this is a good way to prevent attackers from fingerprinting your application.

**Solution**

Disable it using  `app.disable('x-powered-by')` in express

**Fixes**

Implemented in the following files

- *server.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/e5810006cb91fb22bc6287f2dd67ba7c779d26fa)

**Reference**
- <https://www.owasp.org/index.php/Top_10-2017_A6-Security_Misconfiguration>
- <https://expressjs.com/en/advanced/best-practice-security.html>
- <https://blog.risingstack.com/node-js-security-checklist/>