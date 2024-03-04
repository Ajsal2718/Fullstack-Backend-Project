const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("database Connected MongoDb"))
    .catch((err) => console.log(err));
};

module.exports = dbConnect;
