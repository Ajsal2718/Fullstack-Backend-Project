const jwt = require("jsonwebtoken");

module.exports = function generate(id,username){
  const payload = {
    id: id,
    username: username,
  }
  const secretkey = process.env.JWT_KEY;
  const options = {expiresIn:"12h"};

  return jwt.sign(payload,secretkey,options)
}