# Unvalidated Redirects and Forwards

The application fails to perform any validation before redirecting user to external URL based on untrusted user supplied data in the `redirect` function accessible at 

http://127.0.0.1:9090/app/redirect?url=

**Vulnerable Code snippet**

*/core/apphandler.js*
```
...
module.exports.redirect = function(req,res){
    if(req.query.url){
        res.redirect(req.query.url)
    }else{
        res.send('invalid redirect url')
    }
}
...
```

An attacker can exploit this vulnerability using an URL such as below:

```
http://127.0.0.1:9090/redirect.action?url=http://www.attacker.nxd/phising_page
```

**Solution**

Use an interceptor page which requires user approval before external redirection

**Fixes**

Implemented in the following files

- *views/app/redirect.ejs*
- *core/appHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/0df0980a19778e0cf627cd09b365e3e84023cf75)

**Reference**
- https://www.owasp.org/index.php/Unvalidated_Redirects_and_Forwards_Cheat_Sheet