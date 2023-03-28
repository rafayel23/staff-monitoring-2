# Alternative implementation of StaffMonitoring

## UNLIKE PREVIOUS IMPLEMENTATION, THIS IMPLEMENTATION MEETS ALL THE REQUIREMENTS!

### Used tech
 - RxJS
 - OnPush Strategy
 - ES Linter
 - Material Design

Regarding this point from task description - `chose linter configuration but explain why you chose the given configuration`<br/>
I changed only one thing in default ESLint configurations.<br/>
I removed rule forcing to have `app` prefix on directive selectors.<br/>
I did this because created a directive which targets HTML native elements, such as `input[type=time]`.<br/>

<hr/>

API server was throwing CORS error.<br/>
Seems like `jsonServer.defaults({ noCors: true })` option is no longer supported.<br/>
I had to append special middleware.<br/>

```
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
  res.header('Access-Control-Allow-Headers', '*'),
  res.header('Access-Control-Allow-Methods', '*'),
  res.header('Access-Control-Request-Methods', '*'),
  next()
})

```

You need to do that as well before running server in order application to work as expected.<br/>
This topic is discussed here https://stackoverflow.com/questions/66369299/no-cors-config-not-working-with-json-server


<hr/>


`db.json` file coming with the package `@insightfulio/insightful-test-api-server` contains 100 employees each with more than 1000 shifts (in sum this is 100.000+ shifts).<br/>
It causes performance issues and makes application untestable.<br/>
I created a copy of `db.json` file in root directory.<br/>
It is the reduced version of original DB and contains only 15 employees each with 30 shifts (in sum this is 300 shifts).<br/>
You can replace original `db.json` with this file before running server.<br/>

