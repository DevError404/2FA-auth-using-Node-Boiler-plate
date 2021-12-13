const bcrypt = require("bcrypt");

var commonFunctions = {
  generatePasswordHash: (password) => {
    return new Promise((resolve, reject) => {
      if (password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        resolve(hash);
      } else {
        reject({ code: 404, message: "Password string is empty" });
      }
    });
  },
};

module.exports = commonFunctions;
