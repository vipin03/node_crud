require('dotenv').config();

// db connection
let dbConn = function(mysql){
   return mysql.createConnection({
        'host':process.env.HOST,
        'user':process.env.DBUSERNAME,
        'password':process.env.PASSWORD,
        'database':process.env.DBNAME
    
    });
}

exports.dbConn = dbConn;