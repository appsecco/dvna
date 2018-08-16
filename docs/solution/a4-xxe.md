# XML External Entities

The `Bulk Import` feature at http://127.0.0.1:9090/app/bulkproducts is vulnerable to XML External Entity attack.

![xxe1](/resources/xxe1.png)

This can be easily exploited by supplying an input like the one below

```xml
<!DOCTYPE foo [<!ELEMENT foo ANY >
<!ENTITY bar SYSTEM "file:///etc/passwd" >]>
<products>
   <product>
      <name>Playstation 4</name>
      <code>274</code>
      <tags>gaming console</tags>
      <description>&bar;</description>
   </product>
</products>
```

The resulting product's description will have the contents of `/etc/passwd`

![xxe2](/resources/xxe2.png)

**Vulnerable Code snippet**

*core/appHandler.js*
```
...
module.exports.bulkProducts =  function(req, res) {
	if (req.files.products && req.files.products.mimetype=='text/xml'){
		var products = libxmljs.parseXmlString(req.files.products.data.toString('utf8'), {noent:true,noblanks:true})
...
```

**Solution**

The XML parsing library used is `libxmljs` which allows for parsing external entities. We can disable parsing of external entities by modifying the flag value `noent` to `false`.

*core/appHandler.js*
```
...
module.exports.bulkProducts =  function(req, res) {
	if (req.files.products && req.files.products.mimetype=='text/xml'){
		var products = libxmljs.parseXmlString(req.files.products.data.toString('utf8'), {noent:false,noblanks:true})
...
```

**Fixes**

Implemented in the following file

- *core/appHandler.js*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/15f9dc298ff8e46f0dbeca6b260416c086db2446)

**Recommendation**

- Ensure that External entity parsing is disabled
- If parsing is absoutely required, then validate the data before parsing

**Reference**

- <https://www.owasp.org/index.php/Top_10-2017_A4-XML_External_Entities_(XXE)>