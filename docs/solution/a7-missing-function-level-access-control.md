# Missing Function Level Access Control


## Unauthorized Access to Users API

The issue lies in `List Users` API implementation where the code does not correctly establish identity and capability for the calling user before fulfilling the request.

**Vulnerable Code snippet**

*routes/app.js*
```
...
router.get('/admin',authHandler.isAuthenticated,function(req,res){
    res.render('app/admin',{admin: (req.user.role=='admin')})
})

router.get('/admin/api/users',authHandler.isAuthenticated, appHandler.listUsersAPI)
...
```

*views/app/admin.ejs*
```
...
var isAdmin = false;
if(!isAdmin){
    var div = document.getElementById('admin-body');
    div.style.display = "none";
}else{
    var div = document.getElementById('non-admin-body');
    div.style.display = "none";            
}
...
```

By checking the page source, we are able to see the `List Users API` that isn't visible in the Dashboard.

![missing-fn-access](/resources/missing-fn-access.png "API Hidden in Front End")

The API endpoint doesn't check whether the requesting user is an admin. Assuming that an attacker will not be able to access your endpoints because they are hidden is a very bad practice.

**Solution**

The `List Users API` route must check the requesting user's privilege before serving the request.

```
function adminCheck(req,res,next){
    if(req.user.role=='admin')
        next()
    else
        res.status(401).send('Unauthorized')
}

router.get('/admin/api/users',authHandler.isAuthenticated, adminCheck, appHandler.listUsersAPI)
```

**Recommendation**

- Try to restrict your functions to maximum extent, White listing is always better than blacklisting

**Reference**

- https://www.owasp.org/index.php/Top_10_2013-A7-Missing_Function_Level_Access_Control
