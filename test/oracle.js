/* global after, before, describe, ln, it, test */

'use strict'

require('shelljs/global')

var anyDb = require('any-db')
var anyDbJdbc = require('..')
var assert = require('assert')
var promiseify = require('promiseify')

var config = {
  libpath: 'drivers/ojdbc.jar',
  drivername: 'oracle.jdbc.driver.OracleDriver',
  url: 'jdbc:oracle:thin:@192.168.3.61:1321/orcl',
  user: 'sys',
  password: 'Hello123$',
  properties: {
    user: 'sys',
    password: 'Hello123$',
    internal_logon:'SYSDBA'
  }
}

describe('oracle', function () {
  var server

  before(function (done) {
    // create link so any-db can access the driver
    if (!test('-L', 'node_modules/any-db-jdbc')) {
      ln('-s', '..', 'node_modules/any-db-jdbc')
    }
    setTimeout(done, 1000)
  })

  it('should register a configuration', function (done) {
    anyDbJdbc.registerConfig(config)
    // console.log(anyDbJdbc.configs)
    assert.equal(Object.keys(anyDbJdbc.configs).length, 1)
    done()
  })

  it('should establish a connection', function () {
    // console.log(config.url)
    var connection = anyDb.createConnection(config.url, function (err) {
    // var connection = anyDb.createConnection("jdbc:sys:Hello123$:@192.168.3.61:1321/orcl", function (err) {
      console.log("sdfs",err)
   
      // connection.end(function () {
      //   done()
      // })
    })
  })

  it.skip('get databasemeta', function (done) {
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      // console.log(conn.connection.getMetaData)
      const getMetaData = promiseify(conn.connection.getMetaData.bind(conn.connection))
      getMetaData().then(function (meta) {
        const getSchemas = promiseify(meta.getSchemas.bind(meta))
        getSchemas().then(function (schemas) {
          console.log(schemas.result.metaData)
          done()
        })
      })
    })
  })
})
