const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const bcrypt =  require('bcryptjs');

let userRouter = require("./routes/users");

require('dotenv').config()

// initializations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));


// routes
app.use("/users", userRouter);

app.listen(3001,function(){
 console.log("connected ");
});