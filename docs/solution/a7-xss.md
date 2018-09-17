# Cross-site Scripting

![xss1](/resources/xss1.png "XSS")
with input *Inconspicuous Pizza&lt;script&gt;alert('Cookie:'+document.cookie)&lt;/script&gt;*

## Reflected XSS in Search Query

**Note: Chrome XSS Auditor may block XSS Attacks**

A Cross-site scripting vulnerability exists in the following URL

http://127.0.0.1:9090/app/products

**Vulnerable Code snippet**

*/views/app/products.ejs*
```
...
<% if (output&&output.searchTerm) { %>
    <p class="bg-success">
        Listing products with <strong>search query: </strong> 
        <%- output.searchTerm %>
...
```

User supplied input is directly rendered as part of HTML response. This issue can be exploited to inject arbitrary scripting code to perform a Cross-site Scripting attack.

**Solution**

Ensure user supplied or any other untrusted data is not rendered as part of HTTP response without appropriate encoding. EJS escape output tag can be used to render this securely with appropriate encoding such as below

```
<%= output.searchTerm %>
```
Notice the `=` symbol instead of `-`, which escapes the output. Note that this only prevents xss when the target for escaped output is in a html context. 

**Fixes**

Implemented in the following files

- *server.js*
- *views/app/products.ejs*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/6acbb14b51df84d4c4986d95f8fa4e3a6d600e35)

## Stored XSS in Product Listing

Another XSS vulnerability exists in the same page, however at a different location. By supplying an input such as `<script>alert('xss')</script>`, we can verify the XSS

**Vulnerable Code snippet**

*/views/app/products.ejs*
```
...
<td><%- output.products[i].id %></td>
<td><%- output.products[i].name %></td>
<td><%- output.products[i].code %></td>
<td><%- output.products[i].tags %></td>
...
```

**Solution**

Enable output string encoding
```
...
<td><%= output.products[i].id %></td>
<td><%= output.products[i].name %></td>
<td><%= output.products[i].code %></td>
<td><%= output.products[i].tags %></td>
...
```
Notice the `=` symbol instead of `-`, which escapes the output. Note that this only prevents xss when the target for escaped output is in a html context. 

**Fixes**

Implemented in the following files

- *server.js*
- *views/app/products.ejs*

The fix has been implemented in this [commit](https://github.com/appsecco/dvna/commit/6acbb14b51df84d4c4986d95f8fa4e3a6d600e35)

## DOM XSS in user listing

- When registering a user, use the value `<img src="a" onerror="alert(document.domain)">` for "Name"
- When any logged in user visits `/app/admin/users`, an XHR GET request is made to `/app/admin/usersapi` to retrieve the details of users on the application. The details retrieved are used to update the page using `innerHTML` and the details are rendered directly thus making the page vulnerable to XSS

**Vulnerable Code snippet**

*views/app/adminusers.ejs*

```
...
c_id.innerHTML = users[i].id;
c_name.innerHTML = users[i].name;
c_email.innerHTML = users[i].email;
...
```

User supplied input is injected into the page as markup using `innerHTML`. This issue can be exploited to inject arbitrary scripting code to perform a Cross-site Scripting attack.

**Solution**

```
...
c_id.textContent = users[i].id;
c_name.textContent = users[i].name;
c_email.textContent = users[i].email;
...
```
The most fundamental safe way to populate the DOM with untrusted data is to use the safe assignment property, `textContent`.

**Recommendation**

- Use Security header `X-XSS-Protection` to prevent reflected XSS attacks
- Limit raw rendering to internal trusted data only. Do not disable output encoding for untrusted data coming from external sources
- Always validate user input and escape them wherever necessary
- Use cookies securely `httpOnly`, `secure` are enabled in `express-cookies`. Refer to [this](https://expressjs.com/en/advanced/best-practice-security.html)
- Use a Content Security policy for your application using a library like [helmet](https://www.npmjs.com/package/helmet)

**Reference**

- <https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)>
- <https://www.npmjs.com/package/xss-filters>
