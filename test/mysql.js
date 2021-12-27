var anyDb = require('any-db')
var anyDbJdbc = require('..')

var config = {
    libpath: '../drivers/mysql-connector-java-8.0.26.jar',
    drivername: 'com.mysql.cj.jdbc.Driver',
    url: 'jdbc:mysql://192.168.2.179:3306',
    user: 'root',
    password: 'root',
    properties: {
        user: 'root',
        password: 'root'
    }
}

anyDbJdbc.registerConfig(config)

function createConnection(url) {
    return new Promise(function (resolve, reject) {
        anyDb.createConnection(url, function (err, conn) {
            if (err) reject(err)
            resolve(conn)
        })
    })
}

// createConnection(config.url).then(function(conn){
//     // console.log(conn,conn.query)
//     const query = conn.query("select sleep(5),user from mysql.user;",[],function(err,result){
//         if(err) console.log(err)
//         console.log(result)
//     })
// })


function execulteable(url, callback) {
    let query;
    let conn;
    anyDb.createConnection(url, function (err, conn) {
        console.log("conn",new Date().getTime())
        if(err) callback(err)
        conn = conn;
        console.log("query",new Date().getTime())
        query = conn.query("select sleep(3),user from mysql.user;", [], function (err, result) {
            if (err) console.log(err)
            callback(null, result)
        })
    })
    return function () {
            console.log("cancel",new Date().getTime())
            console.log(query)
            if(query==null){
                // conn.end()
            }else{
                query.cancel()
            }
        
    }
}
console.log("start",new Date().getTime())
const execute = execulteable(config.url,function (err,result) {
    console.log("result", result)
})
setTimeout(function(){
    execute()
},4000)



