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

///////// Localhost Port //////////////
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Runnin On Port:"+process.env.PORT);
  }
});
