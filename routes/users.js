const express = require('express');
const router = express.Router();
const bootstrap = require("../bootstarp");
const userController = require("../controllers/UsersController");
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


router.get('/', (req,res)=>{
    let data=  userController.getAllUserV2(dbConn);
    data.then((resData)=>{
        return res.send({"status":true,"data":resData});
    }).catch((err)=>{
        console.log("in catch");
    });
});

router.post('/',(req,res)=>{
    let data = userController.createUser(dbConn,req);
    data.then((result)=>{
        return res.send({"status":false,"message":"Successfully created"});
    }).catch((err)=>{
        console.log(err);
        return res.send({"status":false,"message":"Internal Server Error"});
    })
});

router.get('/:id',(req,res)=>{

    let data = userController.getSingleUser(dbConn,req);
    data.then((result)=>{
        return res.send({"status":true,"data":result});
    }).catch((err)=>{
        return res.send({"status":false,"message":err.message});
    })
    
});

router.put('/',(req,res)=>{

    let data = userController.updateUser(dbConn,req);
    data.then((result)=>{
        return res.send({"status":true});
    }).catch((err)=>{
        return res.send(err);
    })

});

router.delete('/',(req,res)=>{
    
    let data = userController.deleteUser(dbConn,req);
    data.then((result)=>{
        return res.send({"status":true});
    }).catch((err)=>{
        return res.send(err);
    })
});

module.exports = router;