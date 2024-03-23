const express = require("express");
const app = express();
const cors = require('cors')
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

app.use(cookies());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

////////////// User  Routes /////////////
const userRoute = require("./routes/userRouter");
app.use("/api",userRoute);

///////////// Admin Routes ////////////
const adminRoute = require('./routes/adminRouter');
app.use('/api',adminRoute)

///////// Localhost Port //////////////
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Runnin On Port:"+process.env.PORT);
  }
});
