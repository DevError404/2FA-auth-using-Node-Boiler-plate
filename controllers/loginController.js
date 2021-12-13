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
      if (result) {
        bcrypt.compare(req.body.password, result.password).then((bool) => {
          if (!bool) {
            res.send(
              reponseGenerator.getResponse(200, "Success", true, [
                { authyId: result.authyId, message: "Login successful" },
              ])
            );
          } else {
            if (result.role === "Admin") {
              authy.request_sms(result.authyId, function (err, respon) {
                if (err) {
                  res.send(
                    reponseGenerator.getResponse(503, "Error", false, [err])
                  );
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
      } else {
        res.send(
          reponseGenerator.getResponse(403, "Not found", false, [
            { message: "Invalid Credentials" },
          ])
        );
      }
    })
    .catch((err) => {
      res.send(reponseGenerator.getResponse(503, "Error", false, [err]));
    });
};

exports.requestOtp = (req, res) => {
  authy.request_sms(req.body.authyId, function (err, respon) {
    if (err) {
      res.send(reponseGenerator.getResponse(503, "Error", false, [err]));
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
            res.send(reponseGenerator.getResponse(503, "Error", false, [err]));
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
                res.send(
                  reponseGenerator.getResponse(503, "Error", false, [err])
                );
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
      res.send(reponseGenerator.getResponse(503, "Error", false, [err]));
    });
};

exports.verifyOtp = (req, res) => {
  authy.verify(req.body.authyId, req.body.OTP, function (err, response) {
    if (err) res.send(reponseGenerator.getResponse(503, "Error", false, [err]));
    else
      res.send(
        reponseGenerator.getResponse(200, "Success", true, [
          { message: response.message },
        ])
      );
  });
};
