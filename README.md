##exp-query - forked from eth-query

like web3 but for minimalists


```js
var provider = { sendAsync: function(params, cb){/* ... */} }
var query = new ExpQuery(provider)

query.getBalance(address, cb)
```
