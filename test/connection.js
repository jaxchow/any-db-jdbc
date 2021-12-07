const { createConnection } = require("..")

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

anyDbJdbc.registerConfig(config)

export function createConnection(url) {
    return new Promise(resolve, reject){
        anyDb.createConnection(url, function (err, conn) {
            if (err) reject(err)
            resolve(conn)
        }
    }
}
