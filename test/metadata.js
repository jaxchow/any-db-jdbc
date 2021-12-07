const ResultSet = require("jdbc/lib/resultset")
/**
 * 获取连接metadata信息
 * @param {*} connection 
 * @returns Promise
 */

function getMetadata(connection) {
  return new Promise(function (resolve, reject) {
    const conn = connection.connection
    // const metadata = conn.getMetaDataSync()
    // resolve(metadata)
    conn.getMetaData(function (err, metadata) {
      if (err) reject(err)
      resolve(metadata)
    })
  })
}

/**
 * 同步方法获取metadata
 * @param {*} connection 
 * @returns metadata
 */

function getMetadataSync(connection){
    const conn = connection.connection
    return conn.getMetaDataSync()
}

/**
 * 创建新连接信息
 * @param {*} anyDb 
 * @param {*} url 
 * @returns Promise
 */

function createConnection(anyDb, url) {
  return new Promise(function (resolve, reject) {
    var connection = anyDb.createConnection(url, function (err) {
      if (err) reject(err)
      resolve(connection)
    })
  })
}

function getDatabaseInfo(metadata){
  const maxConfig={
    "getMaxTablesInSelect":metadata.getMaxTablesInSelectSync(),
    "getMaxUserNameLength":metadata.getMaxUserNameLengthSync(),
    "getMaxTableNameLength":metadata.getMaxTableNameLengthSync(),
    "getMaxStatements":metadata.getMaxStatementsSync(),
    "getMaxStatementLength":metadata.getMaxStatementLengthSync(),
    "getMaxSchemaNameLength":metadata.getMaxSchemaNameLengthSync(),
    "getMaxRowSize":metadata.getMaxRowSizeSync(),
    "getMaxProcedureNameLength":metadata.getMaxProcedureNameLengthSync(),
    "getMaxCursorNameLength":metadata.getMaxCursorNameLengthSync(),
    "getMaxConnections":metadata.getMaxConnectionsSync(),
    "getMaxColumnsInTable":metadata.getMaxColumnsInTableSync(),
    "getMaxColumnsInSelect":metadata.getMaxColumnsInSelectSync(),
    "getMaxColumnsInOrderBy":metadata.getMaxColumnsInOrderBySync(),
    "getMaxColumnsInIndex":metadata.getMaxColumnsInIndexSync(),
    "getMaxColumnsInGroupBy":metadata.getMaxColumnsInGroupBySync(),
    "getMaxColumnNameLength":metadata.getMaxColumnNameLengthSync(),
    "getMaxCharLiteralLength":metadata.getMaxCharLiteralLengthSync(),
    "getMaxCatalogNameLength":metadata.getMaxCatalogNameLengthSync(),
    "getMaxBinaryLiteralLength":metadata.getMaxBinaryLiteralLengthSync(),
    "getJDBCMinorVersion":metadata.getJDBCMinorVersionSync(),
    "getJDBCMajorVersion":metadata.getJDBCMajorVersionSync(),
    "getExtraNameCharacters":metadata.getExtraNameCharactersSync(),
    "getDriverVersion":metadata.getDriverVersionSync(),
    "getDriverName":metadata.getDriverNameSync(),
    "getDriverMinorVersion":metadata.getDriverMinorVersionSync(),
    "getDriverMajorVersion":metadata.getDriverMajorVersionSync(),
    "getDefaultTransactionIsolation":metadata.getDefaultTransactionIsolationSync(),
    "getDatabaseProductVersion":metadata.getDatabaseProductVersionSync(),
    "getDatabaseProductName":metadata.getDatabaseProductNameSync(),
    "getDatabaseMinorVersion":metadata.getDatabaseMinorVersionSync(),
    "getDatabaseMajorVersion":metadata.getDatabaseMajorVersionSync(),
    "allTablesAreSelectable":metadata.allTablesAreSelectableSync(),
    "allProceduresAreCallable":metadata.allProceduresAreCallableSync(),
    "autoCommitFailureClosesAllResultSets":metadata.autoCommitFailureClosesAllResultSetsSync(),
    "dataDefinitionCausesTransactionCommit":metadata.dataDefinitionCausesTransactionCommitSync(),
    "dataDefinitionIgnoredInTransactions":metadata.dataDefinitionIgnoredInTransactionsSync(),
    "doesMaxRowSizeIncludeBlobs":metadata.doesMaxRowSizeIncludeBlobsSync(),
  }
  return maxConfig
}


function resultSetToArray(err, resultset) {
  return new Promise(function (resolve, reject) {
    if (err) reject(err)
    const rs = new ResultSet(resultset)
    rs.toObjArray(function (err, array) {
      if (err) reject(err)
      resolve(array)
    })
  })
}

function getSchema(metadata) {
  return new Promise(function (resolve, reject) {
    metadata.getSchemas(function (err, resultSet) {
      if (err) reject(err)
      resultSetToArray(err, resultSet).then(function (array) {
        resolve(array)
      }).catch(function (err) {
        reject(err)
      })
      // const rs= new ResultSet(resultSet)
      // rs.toObjArray(function(err,array){
      //   if(err) reject(err)
      //   resolve(array)
      // })
    })
  })
}

function getCatalogs(metadata) {
  return new Promise(function (resolve, reject) {
    metadata.getCatalogs(function (err, resultSet) {
      if (err) reject(err)
      resultSetToArray(err, resultSet).then(function (array) {
        resolve(array)
      }).catch(function (err) {
        reject(err)
      })
    })
  })
}

function getTablesSync(metadata,schema){
  const reusltset =  metadata.getTablesSync('',schema,'%',null)
  const rs = new ResultSet(reusltset)
  return rs
}


function getTables(metadata,schema){
  return new Promise(function(resolve,reject){
    // console.log(metadata.getTablesSync('',schema,'%',null))
    metadata.getTables('',schema,'%',null,function (err, resultSet) {
      if (err) reject(err)
      resultSetToArray(err, resultSet).then(function (array) {
        resolve(array)
      }).catch(function (err) {
        reject(err)
      })
    }) 
  })
}
module.exports = {
  getCatalogs,
  getSchema,
  getTables,
  getDatabaseInfo,
  getTablesSync,
  getMetadataSync,
  createConnection,
  getMetadata
}