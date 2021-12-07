/* global after, before, describe, ln, it, test */

'use strict'

require('shelljs/global')

var anyDb = require('any-db')
var anyDbJdbc = require('..')
var assert = require('assert')
var promiseify = require('promiseify')
const Connection = require('jdbc/lib/connection')

var config = {
  libpath: 'drivers/Dm7JdbcDriver18-7.6.0.jar',
  drivername:'dm.jdbc.driver.DmDriver',
  url:'jdbc:dm://192.168.3.128:5237',
  user: 'SYSDBA',
  password: 'SYSDBA',
  properties: {
    user: 'SYSDBA',
    password: 'SYSDBA'
  }
}

describe('dm8', function () {
  var server

  before(function (done) {
    // create link so any-db can access the driver
    if (!test('-L', 'node_modules/any-db-jdbc')) {
      ln('-s', '..', 'node_modules/any-db-jdbc')
    }
    setTimeout(done, 1000)
  })

  
  it('should register a configuration', function () {
    anyDbJdbc.registerConfig(config)
    assert.equal(Object.keys(anyDbJdbc.configs).length, 1)
  })

  it('should establish a connection', function (done) {
    var connection = anyDb.createConnection(config.url, function (err) {
      assert.equal(err, null)
      connection.end(function () {
        done()
      })
    })
  })
  it('query sql select * from "SYSAUDIT"."user" ',function(done){
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      const query = promiseify(conn.query.bind(conn))
      query('select * from "SYSDBA"."DDD"').then(function(result){
        // console.log(result)
        // assert.equal(result.rows.length,[].length)
        done()
      })
    }) 
  })


  it('insert "SYSAUDIT"."user" ',function(done){
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      const query = promiseify(conn.query.bind(conn))
      query('INSERT INTO "SYSDBA"."DDD" (ID) values(222)').then(function(result){
        console.log(result)
        // assert.equal(result.rows.length,[].length)
        done()
      })
    }) 
  })

  it('update  "SYSAUDIT"."DDD" ',function(done){
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      const query = promiseify(conn.query.bind(conn))
      query('UPDATE "SYSDBA"."DDD" SET ID = 1111 where ID = 222').then(function(result){
        console.log(result)
        // assert.equal(result.rows.length,[].length)
        done()
      })
    }) 
  })

  it.skip('get connection getSchema',function(done){
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      conn.connection.getSchema(function(err,result){
        console.log(result)
        done()
      })
    }) 
  })
  it('get databasemeta', function (done) {
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      const connect = new Connection(conn.connection)
      const getMetaData = promiseify(connect.getMetaData.bind(connect))
      getMetaData().then(function (meta) {
        const getTableTypes = promiseify(meta.getTableTypes.bind(meta))
        getTableTypes().then(function(trs){
          const toObjArray = promiseify(trs.toObjArray.bind(trs))
          toObjArray().then(function(array){
            console.log(array)
            done()
          })
        })
       
      })
    })
  })
})
