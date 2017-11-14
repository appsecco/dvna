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
Notice the `=` symbol instead of `-`, which escapes the output

## Stored XSS in Product Listing

Another XSS vulnerability exists in the same page, however at a different location

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
Notice the `=` symbol instead of `-`, which escapes the output

**Recommendation**

- Use Security header `X-XSS-Protection` to prevent reflected XSS attacks
- Limit raw rendering to internal trusted data only. Do not disable output encoding for untrusted data coming from external sources
- Always validate user input and escape them wherever necessary
- Use cookies securely `httpOnly`, `secure` are enabled in `express-cookies`. Refer to [this](https://expressjs.com/en/advanced/best-practice-security.html)
- Use a Content Security policy for your application using a library like [helmet](https://www.npmjs.com/package/helmet)

**Reference**

- https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)
- https://www.npmjs.com/package/xss-filters
