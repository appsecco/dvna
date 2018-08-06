# Insecure Deserialization

There input file to legacy bulk import feature does not securely deserialize the causing  

http://127.0.0.1:9090/app/usersearch

**Vulnerable Code snippet**

*core/appHandler.js*
```         
...

...
```
**Solution**


*core/appHandler.js*
```
...

...
```

But it is recommended to explicitly validate/sanitize inputs

**Fixes**

Implemented in the following files

- *core/appHandler.js*

**Recommendation**

- Validate Input before processing
- Sanitize Input before storing

**Reference**

- <https://www.owasp.org/index.php/Top_10-2017_A8-Insecure_Deserialization>