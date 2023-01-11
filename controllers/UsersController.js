const bcrypt =  require('bcryptjs');

module.exports = {
    getALLUsers :  async (dbConn)=>{
        let data = await dbConn.query("select * from users",(error, results, fields)=>{
            if(error){
                throw error;
            }
            return ["abc","1212"];
            // console.log(results);
            return results;
        });
    },

    getAllUserV2 : (dbConn)=> {
        return new Promise(function(resolve, reject) {
            dbConn.query("select * from users",(error, results, fields)=>{
                if(error){
                    reject(error);
                }
                resolve(results);
            });
        });
    },

    createUser : (dbConn,req) => {
        return new Promise((resolve,reject)=>{
            let currentP = req.body.password;
            let hashPass = bcrypt.hashSync(req.body.password, 8);
            let sql =`INSERT INTO users (name, email,password) VALUES ('${req.body.name}', '${req.body.email}','${hashPass}')`;
            dbConn.query(sql,(error, results, fields)=>{
                if(error){
                    reject(error);
                }
                resolve("Successful");
            });
        });
    },

    getSingleUser : (dbConn,req)=>{
        return new Promise((resolve,reject)=>{
            dbConn.query(`select * from users where id =${req.params.id}`,(error, results, fields)=>{
                if(error){
                    reject(error);
                }
                let reqToken = req.headers.api_token;
                if(reqToken != results[0]['api_token']){
                    reject({"status":false,"message":"Your are not authorized to access this"})
                }
                resolve(results);
            });
        })
    },

    updateUser : (dbConn,req) =>{
        return new Promise((resolve,reject)=>{
            dbConn.query(`select * from users where id =${req.body.id}`,(error, results, fields)=>{
                if(error){
                    throw error;
                }
                let reqToken = req.headers.api_token;
                if(reqToken != results[0]['api_token']){
                    reject({"status":false,"message":"Your are not authorized to access this"});
                }
        
                dbConn.query(`update users set name = '${req.body.name}' where id =${req.body.id}`,(error, results, fields)=>{
                    if(error){
                        reject(error);
                    }
                    resolve(true);
                });
            });
        });
    },

    deleteUser : (dbConn,req)=>{
        return new Promise((resolve,reject)=>{
            dbConn.query(`select * from users where id =${req.body.id}`,(error, results, fields)=>{
                if(error){
                    reject(error);
                }
                let reqToken = req.headers.api_token;
                if(reqToken != results[0]['api_token']){
                    resolve({"status":false,"message":"Your are not autoried to access this"})
                }
        
                dbConn.query(`DELETE FROM users WHERE id = ${req.body.id}`,(error, results, fields)=>{
                    if(error){
                        reject(error);
                    }
                    reject({"status":true,"message":"Data delete success"});
                });
            });
        })
        
    }
}