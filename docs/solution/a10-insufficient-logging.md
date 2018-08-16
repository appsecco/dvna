# Insufficient Logging and Monitoring

Exploitation of insufficient logging and monitoring is the bedrock of nearly every major incident.

- Auditable events, such as logins, failed logins, and high-value transactions are not logged.
- Warnings and errors generate no, inadequate, or unclear log messages.
- Logs of applications and APIs are not monitored for suspicious activity.
- Logs are only stored locally.
- Appropriate alerting thresholds and response escalation processes are not in place or effective.
- Penetration testing and scans by DAST tools (such as OWASP ZAP) do not trigger alerts.
- The application is unable to detect, escalate, or alert for active attacks in real time or near real time.

**Solution**

All critical functionalities of the application must be logged. We use winston, a logging library to handle our logging.

Define a default logger

*server.js*
```js
var winston = require('winston')
...
winston.configure({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
...
```

Log from anywhere

*core/passport.js*
```js
var winston = requir('winston')
...
if (!isValidPassword(user, password)) {
    winston.log({level:'warn',message:'Failed login attempt for ', username})
    return done(null, false, req.flash('danger', 'Invalid Credentials'))
}
...
```

**Fixes**

Implemented in the following files

- *server.js*
- *core/passport.js*
- *core/authHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/56c5e82c1a000e26ae19afb67b6696d634ceab2e)

**Recommendation**

- Log all sensitive operations by default
- Ensure that the logs are stored and processed securely

**Reference**

- <https://www.owasp.org/index.php/Top_10-2017_A10-Insufficient_Logging%26Monitoring>