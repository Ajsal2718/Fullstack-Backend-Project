const express = require("express");
const app = express();

const cookies = require("cookie-parser");

///////////// DB Connection //////////
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
dotenv.config({ path: "./config/config.env" });
dbConnect();

app.use(express.json());
app.use(cookies());



const userformRoute = require("./routes/userRouter");
app.use("/api", userformRoute);

// const cors = require('cors')
// app.use(cors({
//   origin: 'http://localhost:2718',
//   credentials: true // change to specific domain if needed
// }));


// app.get('/hellow',(req,res)=>{
//      res.status(200).json({
//         Data:`we are get in`
//      })
// })
// // app.use(express.urlencoded({extended:false}))

///////// Localhost Port //////////////
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfull")
  }
});
