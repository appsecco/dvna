# Insecure Direct Object Reference

An Insecure Direct Object Reference \(IDOR\) vulnerability exists in `Edit User` functionality. Particularly `userEditSubmit` method fails to validate `id` parameter to ensure that the calling user has appropriate access to the object. This issue can be exploited to reset information for any user identified by id.

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

Consider any user supplied information as untrusted and always validate user access by sessions

**Reference**
- https://www.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References