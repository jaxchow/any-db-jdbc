/* global after, before, describe, ln, it, test */

'use strict'

require('shelljs/global')

var anyDb = require('any-db')
var anyDbJdbc = require('..')
var assert = require('assert')
var spawn = require('child_process').spawn
var promiseify = require('promiseify')

var config = {
  libpath: 'drivers/hsqldb.jar',
  drivername: 'org.hsqldb.jdbc.JDBCDriver',
  uri: 'jdbc:hsqldb:hsql://localhost/xdb'
}

describe('hsqldb', function () {
  var server

  before(function (done) {
    // create link so any-db can access the driver
    if (!test('-L', 'node_modules/any-db-jdbc')) {
      ln('-s', '..', 'node_modules/any-db-jdbc')
    }

    // start hsqldb server
    server = spawn('java', ['-cp', 'drivers/hsqldb.jar', 'org.hsqldb.server.Server', '--database.0', 'file:mydb', '--dbname.0', 'xdb'])

    // wait for server to start
    setTimeout(done, 1000)
  })

  after(function () {
    server.kill()
  })

  it('should register a configuration', function () {
    anyDbJdbc.registerConfig(config)

    assert.equal(Object.keys(anyDbJdbc.configs).length, 1)
  })

  it.skip('should establish a connection', function (done) {
    var connection = anyDb.createConnection(config.url, function (err) {
      assert.equal(err, null)

      connection.end(function () {
        done()
      })
    })
  })

  it.skip('should close a connection', function (done) {
    var connection = anyDb.createConnection(config.url, function () {
      connection.end(function (err) {
        assert.equal(err, null)

        done()
      })
    })
  })

  it.skip('should run a update query', function (done) {
    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255));', function (err) {
          assert.equal(err, null)

          connection.end(function () {
            done()
          })
        })
      })
    })
  })

  it.skip('should run a select query', function (done) {
    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255));', function () {
          connection.query('INSERT INTO test VALUES (1, \'test\')', function () {
            connection.query('SELECT * FROM test', function (err, result) {
              assert.equal(err, null)
              assert.deepEqual(result, {
                fieldCount: 2, fields: [
                  {
                    label: 'ID',
                    name: 'ID',
                    type: 4,
                    typeName: 'INTEGER'
                  },
                  {
                    label: 'TEXT',
                    name: 'TEXT',
                    type: 12,
                    typeName: 'VARCHAR'
                  }
                ], rows: [{ ID: 1, TEXT: 'test' }]
              })

              connection.end(function () {
                done()
              })
            })
          })
        })
      })
    })
  })

  it.skip('should support events for select query', function (done) {
    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255));', function () {
          connection.query('INSERT INTO test VALUES (1, \'test\')', function () {
            connection.query('SELECT * FROM test').on('row', function (row) {
              assert.deepEqual(row, { ID: 1, TEXT: 'test' })

              connection.end(function () {
                done()
              })
            })
          })
        })
      })
    })
  })

  it.skip('should run a parameterized integer select query', function (done) {
    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255));', function () {
          connection.query('INSERT INTO test VALUES (1, \'test\')', function () {
            connection.query('SELECT * FROM test WHERE ID = ?', [1], function (err, result) {
              assert.equal(err, null)
              assert.deepEqual(result, {
                fieldCount: 2, fields: [
                  {
                    label: 'ID',
                    name: 'ID',
                    type: 4,
                    typeName: 'INTEGER'
                  },
                  {
                    label: 'TEXT',
                    name: 'TEXT',
                    type: 12,
                    typeName: 'VARCHAR'
                  }
                ], rows: [{ ID: 1, TEXT: 'test' }]
              })

              connection.end(function () {
                done()
              })
            })
          })
        })
      })
    })
  })

  it.skip('should run a parameterized string select query', function (done) {
    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255));', function () {
          connection.query('INSERT INTO test VALUES (1, \'test\')', function () {
            connection.query('SELECT * FROM test WHERE TEXT = ?', ['test'], function (err, result) {
              assert.equal(err, null)
              assert.deepEqual(result, {
                fieldCount: 2, fields: [
                  {
                    label: 'ID',
                    name: 'ID',
                    type: 4,
                    typeName: 'INTEGER'
                  },
                  {
                    label: 'TEXT',
                    name: 'TEXT',
                    type: 12,
                    typeName: 'VARCHAR'
                  }
                ], rows: [{ ID: 1, TEXT: 'test' }]
              })

              connection.end(function () {
                done()
              })
            })
          })
        })
      })
    })
  })

  it.skip('should run a parameterized date select query', function (done) {
    var date = new Date()

    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255), CREATED DATE);', function () {
          connection.query('INSERT INTO test VALUES (1, \'test\', ?)', [date], function () {
            connection.query('SELECT * FROM test WHERE CREATED = ?', [date], function (err, result) {
              assert.equal(err, null)
              assert.deepEqual(result, {
                fieldCount: 3, fields: [
                  {
                    label: 'ID',
                    name: 'ID',
                    type: 4,
                    typeName: 'INTEGER'
                  },
                  {
                    label: 'TEXT',
                    name: 'TEXT',
                    type: 12,
                    typeName: 'VARCHAR'
                  },
                  {
                    label: 'CREATED',
                    name: 'CREATED',
                    type: 91,
                    typeName: 'DATE'
                  }
                ],
                rows: [{ ID: 1, TEXT: 'test', CREATED: date.toISOString().slice(0, 10) }]
              })

              connection.end(function () {
                done()
              })
            })
          })
        })
      })
    })
  })

  it.skip('should run a parameterized date insert', (done) => {
    var date = new Date()
    var connection = anyDb.createConnection(config.url, function () {
      connection.query('DROP TABLE test;', function () {
        connection.query('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255), CREATED DATE);', function () {
          connection.query('INSERT INTO test VALUES (2, \'test\', ?)', [date], function (err, result) {
            if (err) {
              console.log(err)
            }
            assert.deepEqual(result, {
              affectedRows: 1
            })
            connection.end(function () {
              done()
            })
          })
        })
      })
    })
  })

  it('get databasemeta', function (done) {
    const anyDbPromise = promiseify(anyDb.createConnection)
    anyDbPromise(config.url).then(function (conn) {
      // console.log(conn.connection.getMetaData)
      const getMetaData = promiseify(conn.connection.getMetaData.bind(conn.connection))
      getMetaData().then(function (meta) {
        const getSchemas = promiseify(meta.getSchemas.bind(meta))
        getSchemas().then(function (schemas) {
          console.log(schemas.result.metaData)
          done()
          // schemas.toObjArray(function (rows) {
          //   console.log(rows)
          //   done()
          // })
        })
      })
    })
  })
  // it('should promise', function (done) {
  //   const anyDbPromise = promiseify(anyDb.createConnection)
  //   anyDbPromise(config.url).then(function (conn) {
  //     const queryPromise = promiseify(conn.query.bind(conn))
  //     queryPromise('DROP TABLE test;').then(function (result) {
  //       // console.log(result)
  //     }).catch(function (e) {
  //       // console.log(e)
  //     })

  //     queryPromise('CREATE TABLE test(ID INTEGER, TEXT VARCHAR(255), CREATED DATE);').then(function (result) {
  //       console.log(result)
  //       done()
  //     })
  //   })
  // })
})
