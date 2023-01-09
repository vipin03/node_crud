const express = require('express');
const router = express.Router();
const bootstrap = require("../bootstarp");
const mysql = require('mysql');
// bootstrap db and mysql
let dbConn = bootstrap.dbConn(mysql);

router.post('/login',(req,res)=>{
    // console.log(`select * from users where email='${req.body.email}'`)
    dbConn.query(`select * from users where email='${req.body.email}'`,(error,results,fields)=>{
        if(error){
            throw error;
        }
        let dBhashPass = results[0]['password'];
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            dBhashPass
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password!",
            });
        }

        // create token 
        let dummyTokenText="querty123";
        let token = bcrypt.hashSync(dummyTokenText, 8);
        // update token in db
        dbConn.query(`update users set api_token = '${token}' where id =${results[0]['id']}`,(error, results, fields)=>{
            if(error){
                throw error;
            }
        });
        return res.send({"token":token});
    });
});


router.get('/',(req,res)=>{

    dbConn.query("select * from users",(error, results, fields)=>{
        if(error){
            throw error;
        }
        return res.send({"status":true,"message":"Data fetch success","results":results});
    });
});

router.post('/',(req,res)=>{

    let currentP = req.body.password;
    let hashPass = bcrypt.hashSync(req.body.password, 8);
    dbConn.query(`INSERT INTO users (name, email,password) VALUES
    ('${req.body.name}', '${req.body.email}','${hashPass}')`,(error, results, fields)=>{
        if(error){
            throw error;
        }
        return res.send({"status":true,"message":"Data Insert success","results":results});
    });
});

router.get('/:id',(req,res)=>{
    //validate
    
    dbConn.query(`select * from users where id =${req.params.id}`,(error, results, fields)=>{
        if(error){
            throw error;
        }
        let reqToken = req.headers.api_token;
        if(reqToken != results[0]['api_token']){
            return res.send({"status":false,"message":"Your are not autoried to access this"})
        }
        return res.send({"status":true,"message":"Data fetch success","results":results});
    });
});

router.put('/',(req,res)=>{

    dbConn.query(`select * from users where id =${req.body.id}`,(error, results, fields)=>{
        if(error){
            throw error;
        }
        let reqToken = req.headers.api_token;
        if(reqToken != results[0]['api_token']){
            return res.send({"status":false,"message":"Your are not autoried to access this"})
        }

        dbConn.query(`update users set name = '${req.body.name}' where id =${req.body.id}`,(error, results, fields)=>{
            if(error){
                throw error;
            }
            return res.send({"status":true,"message":"Data update success"});
        });
    });

});

router.delete('/',(req,res)=>{
    
    dbConn.query(`select * from users where id =${req.body.id}`,(error, results, fields)=>{
        if(error){
            throw error;
        }
        let reqToken = req.headers.api_token;
        if(reqToken != results[0]['api_token']){
            return res.send({"status":false,"message":"Your are not autoried to access this"})
        }

        dbConn.query(`DELETE FROM users WHERE id = ${req.body.id}`,(error, results, fields)=>{
            if(error){
                throw error;
            }
            return res.send({"status":true,"message":"Data delete success"});
        });
    });
    
});

module.exports = router;