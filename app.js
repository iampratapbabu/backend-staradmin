const express = require('express');
const path=require("path");
//all required route files
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();
app.use(express.json())

//for cors error
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//static folders
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.get('/',(req,res)=>{
    res.send("Backend started");
});

//route middlewares
app.use('/users',userRouter);
app.use('/category',categoryRouter);



module.exports=app;