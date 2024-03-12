const express = require("express");
const cors = require('cors')
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const cookies = require("cookie-parser");
app.use(cors({
  origin: 'http://localhost:2718',
  credentials: true
}));

///////////// DB Connection //////////
const dbConnect = require("./config/dbConnect");
dbConnect();

app.use(express.json());
app.use(cookies());



const userRoute = require("./routes/userRouter");
app.use("/api",userRoute);
// const otpRoutes = require('./routes/otpRoutes');
// app.use('/api',otpRoutes)
// const autheRoute = require('./routes/authRoute')
// app.use('/api',autheRoute)


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
    console.log("Server Runnin On Port:"+process.env.PORT);
  }
});
