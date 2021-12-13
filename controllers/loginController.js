const commonFunctions = require("../utils/common");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const reponseGenerator = require("../utils/responseGenerator");
const dotenv = require("dotenv");
dotenv.config();
const authy = require("authy")(process.env.ACCOUNT_SECURITY_API_KEY);

exports.adminLogin = (req, res) => {
  console.log(req.body);
  User.findOne({
    raw: true,
    where: { name: req.body.username },
  })
    .then((result) => {
      bcrypt.compare(req.body.password, result.password).then((bool) => {
        if (!bool) {
          console.log("Wrong credentials");
        } else {
          if (result.role === "Admin") {
            authy.request_sms(result.authyId, function (err, respon) {
              if (err) {
                console.log(err);
              } else {
                res.send(
                  reponseGenerator.getResponse(200, "Success", true, [
                    { authyId: result.authyId, message: respon.message },
                  ])
                );
              }
            });
          } else {
            res.send(
              reponseGenerator.getResponse(200, "Success", true, [
                { authyId: result.authyId, message: "Login successful" },
              ])
            );
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.requestOtp = (req, res) => {
  authy.request_sms(req.body.authyId, function (err, respon) {
    if (err) {
      console.log(err);
    } else {
      res.send(
        reponseGenerator.getResponse(200, "Success", true, [
          { authyId: req.body.authyId, message: respon.message },
        ])
      );
    }
  });
};

exports.registerUser = (req, res) => {
  commonFunctions
    .generatePasswordHash(req.body.password)
    .then((hashPassword) => {
      authy.register_user(
        req.body.email,
        req.body.contact,
        "91",
        (err, response) => {
          if (err) {
            console.log(err);
          } else {
            User.create({
              name: req.body.username,
              password: hashPassword,
              contact: req.body.contact,
              email: req.body.email,
              role: req.body.role,
              authyId: response.user.id,
            });
            authy.request_sms(response.user.id, function (err, respon) {
              if (err) {
                console.log(err);
              } else {
                res.send(
                  reponseGenerator.getResponse(200, "Success", true, [
                    { authyId: response.user.id, message: respon.message },
                  ])
                );
              }
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.verifyOtp = (req, res) => {
  authy.verify(req.body.authyId, req.body.OTP, function (err, response) {
    if (err) console.log(err);
    else console.log(response);
  });
};
