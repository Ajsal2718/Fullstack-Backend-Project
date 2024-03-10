const jwt = require("jsonwebtoken");
exports.signAccessToken = (userData) => {
    return new Promise((resolve, reject) => {
      const payload = { userData };
      const secretkey = process.env.JWT_KEY;
      const options = { expiresIn: "12h" };
    });

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  }
