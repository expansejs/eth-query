const extend = require('xtend')
const createRandomId = require('json-rpc-random-id')()

module.exports = ExpQuery


function ExpQuery(provider){
  const self = this
  self.currentProvider = provider
}

//
// base queries
//

// default block
ExpQuery.prototype.getBalance =                          generateFnWithDefaultBlockFor(2, 'eth_getBalance')
ExpQuery.prototype.getCode =                             generateFnWithDefaultBlockFor(2, 'eth_getCode')
ExpQuery.prototype.getTransactionCount =                 generateFnWithDefaultBlockFor(2, 'eth_getTransactionCount')
ExpQuery.prototype.getStorageAt =                        generateFnWithDefaultBlockFor(3, 'eth_getStorageAt')
ExpQuery.prototype.call =                                generateFnWithDefaultBlockFor(2, 'eth_call')
// standard
ExpQuery.prototype.protocolVersion =                     generateFnFor('eth_protocolVersion')
ExpQuery.prototype.syncing =                             generateFnFor('eth_syncing')
ExpQuery.prototype.coinbase =                            generateFnFor('eth_coinbase')
ExpQuery.prototype.mining =                              generateFnFor('eth_mining')
ExpQuery.prototype.hashrate =                            generateFnFor('eth_hashrate')
ExpQuery.prototype.gasPrice =                            generateFnFor('eth_gasPrice')
ExpQuery.prototype.accounts =                            generateFnFor('eth_accounts')
ExpQuery.prototype.blockNumber =                         generateFnFor('eth_blockNumber')
ExpQuery.prototype.getBlockTransactionCountByHash =      generateFnFor('eth_getBlockTransactionCountByHash')
ExpQuery.prototype.getBlockTransactionCountByNumber =    generateFnFor('eth_getBlockTransactionCountByNumber')
ExpQuery.prototype.getUncleCountByBlockHash =            generateFnFor('eth_getUncleCountByBlockHash')
ExpQuery.prototype.getUncleCountByBlockNumber =          generateFnFor('eth_getUncleCountByBlockNumber')
ExpQuery.prototype.sign =                                generateFnFor('eth_sign')
ExpQuery.prototype.sendTransaction =                     generateFnFor('eth_sendTransaction')
ExpQuery.prototype.sendRawTransaction =                  generateFnFor('eth_sendRawTransaction')
ExpQuery.prototype.estimateGas =                         generateFnFor('eth_estimateGas')
ExpQuery.prototype.getBlockByHash =                      generateFnFor('eth_getBlockByHash')
ExpQuery.prototype.getBlockByNumber =                    generateFnFor('eth_getBlockByNumber')
ExpQuery.prototype.getTransactionByHash =                generateFnFor('eth_getTransactionByHash')
ExpQuery.prototype.getTransactionByBlockHashAndIndex =   generateFnFor('eth_getTransactionByBlockHashAndIndex')
ExpQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('eth_getTransactionByBlockNumberAndIndex')
ExpQuery.prototype.getTransactionReceipt =               generateFnFor('eth_getTransactionReceipt')
ExpQuery.prototype.getUncleByBlockHashAndIndex =         generateFnFor('eth_getUncleByBlockHashAndIndex')
ExpQuery.prototype.getUncleByBlockNumberAndIndex =       generateFnFor('eth_getUncleByBlockNumberAndIndex')
ExpQuery.prototype.getCompilers =                        generateFnFor('eth_getCompilers')
ExpQuery.prototype.compileLLL =                          generateFnFor('eth_compileLLL')
ExpQuery.prototype.compileSolidity =                     generateFnFor('eth_compileSolidity')
ExpQuery.prototype.compileSerpent =                      generateFnFor('eth_compileSerpent')
ExpQuery.prototype.newFilter =                           generateFnFor('eth_newFilter')
ExpQuery.prototype.newBlockFilter =                      generateFnFor('eth_newBlockFilter')
ExpQuery.prototype.newPendingTransactionFilter =         generateFnFor('eth_newPendingTransactionFilter')
ExpQuery.prototype.uninstallFilter =                     generateFnFor('eth_uninstallFilter')
ExpQuery.prototype.getFilterChanges =                    generateFnFor('eth_getFilterChanges')
ExpQuery.prototype.getFilterLogs =                       generateFnFor('eth_getFilterLogs')
ExpQuery.prototype.getLogs =                             generateFnFor('eth_getLogs')
ExpQuery.prototype.getWork =                             generateFnFor('eth_getWork')
ExpQuery.prototype.submitWork =                          generateFnFor('eth_submitWork')
ExpQuery.prototype.submitHashrate =                      generateFnFor('eth_submitHashrate')

// network level

ExpQuery.prototype.sendAsync = function(opts, cb){
  const self = this
  self.currentProvider.sendAsync(createPayload(opts), function(err, response){
    if (!err && response.error) err = new Error('ExpQuery - RPC Error - '+response.error.message)
    if (err) return cb(err)
    cb(null, response.result)
  })
}

// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
