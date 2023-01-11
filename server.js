const app = require('./app');
const mongoose = require('mongoose')

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


const DB = process.env.DATABASE;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {})
  .then(() => {
    console.log("database connected successfully");
  });



const port = 3200;
app.listen(port,()=>{
    console.log(`Server is Running on ${port}`);
})