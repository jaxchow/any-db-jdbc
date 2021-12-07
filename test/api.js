/* global after, before, describe, ln, it, test */

'use strict'

require('shelljs/global')

var anyDb = require('any-db')
var anyDbJdbc = require('..')
var assert = require('assert')
var promiseify = require('promiseify')
const Connection = require('jdbc/lib/connection')
const { createConnection,getMetadataSync, getSchema, getMetadata, getCatalogs, getTables,getTablesSync,getDatabaseInfo } = require('./metadata')
const ResultSet = require('jdbc/lib/resultset')

var config = {
  libpath: 'drivers/Dm7JdbcDriver18-7.6.0.jar',
  drivername: 'dm.jdbc.driver.DmDriver',
  url: 'jdbc:dm://192.168.3.128:5237',
  user: 'SYSAUDITOR',
  password: 'SYSAUDITOR',
  properties: {
    user: 'SYSAUDITOR',
    password: 'SYSAUDITOR'
  }
}

describe('dm8 for api', function () {
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
    createConnection(anyDb, config.url).then(function (conn) {
      assert.notEqual(conn, null)
      done()
    })
  })

  it('get connection databaseMetadata', function (done) {
    createConnection(anyDb, config.url).then(function (conn) {
      getMetadata(conn).then(function (metadata) {
        assert.notEqual(null, metadata)
        done()
      })
    })
  })

  it('get databasemeta getSchema', function (done) {
    createConnection(anyDb, config.url).then(function (conn) {
      getMetadata(conn).then(function (metadata) {
        getSchema(metadata).then(function(schemas){
          assert.notEqual(null, schemas)
          console.log(schemas)
          done()
        })
      })
    })
  })

  it('get databasemeta getCatalogs',function(done){
    createConnection(anyDb, config.url).then(function (conn) {
      return new Promise(function(resolve,reject){
        getMetadata(conn).then(function (metadata) {
          resolve(metadata)
        }).catch(function(err){
          reject(err)
        })
      })
    }).then(function(metadata){
      getCatalogs(metadata).then(function(catalogs){
        assert.notEqual(null, catalogs)
        console.log("catalogs",catalogs)
        done()
      }).catch((err)=>console.log(err))
    }) 
  })

  it('get databasemeta getTables',function(done){
    createConnection(anyDb, config.url).then(function (conn) {
      return new Promise(function(resolve,reject){
          const metadata = getMetadataSync(conn)
          const rs = getTablesSync(metadata,'CTISYS')
          // console.log(rs)
          assert.notEqual(null,rs)
          done()
          // rs.toObjArray
      })
    }) 
  })

  it('get ddatabase metadata max',function(done){
    createConnection(anyDb, config.url).then(function (conn) {
      const metadata = getMetadataSync(conn) 
      
      console.log(getDatabaseInfo(metadata))
      done()
    }) 
  })

  it('get databasemeta getTypes',function(done){
    createConnection(anyDb, config.url).then(function (conn) {
      return new Promise(function(resolve,reject){
          const metadata = getMetadataSync(conn)
          const typeInfoRs =  metadata.getTypeInfoSync()
          const rs = new ResultSet(typeInfoRs)
          rs.toObjArray(function(err,array){
            console.log(array.length)
          })
          const tableTypesRs = metadata.getTableTypesSync()
          const trs = new ResultSet(tableTypesRs)
          trs.toObjArray(function(err,array){
            console.log(array.length)
          })
      })
    }) 
  })

})
