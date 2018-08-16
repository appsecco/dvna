# Broken Access Control

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

**Fixes**

Implemented in the following files

- *core/authHandler.js*
- *routes/app.js*
- *views/app/admin.ejs*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/1d10d266567a6b721bd368500838756e1cd7966b)

## Missing Authorization check in Edit User

The `userEditSubmit` method fails to validate `id` parameter to ensure that the calling user has appropriate access to the object. This issue can be exploited to reset information for any user identified by id.

http://127.0.0.1:9090/app/useredit

**Vulnerable Code snippet**

*core/apphandler.js*
```
...
module.exports.userEditSubmit = function(req,res){
    if(req.body.password==req.body.cpassword){
        db.User.find({where:{'id':req.body.id}}).then(user=>{
            if(user){
                user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null)
                user.save().then(function(){
...
```

Simply changing the user id in the page can lead to exploitation.<br><br>
![idor1](/resources/idor1.png "IDOR")

**Solution**

A simple check can solve this issue
```
if (req.user.id == req.body.id)
 //do
else
 //dont
```

In our case we can use passports user object at `req.user` for modifying user information

**Fixes**

Implemented in the following files

- *core/appHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/edfe31c81e8594ac336b3fd3a558e174af9fe7b3)

**Recommendation**

- Try to restrict your functions to maximum extent, White listing is always better than blacklisting
- Consider any user supplied information as untrusted and always validate user access by sessions

**Reference**

- <https://www.owasp.org/index.php/Top_10-2017_A5-Broken_Access_Control>
