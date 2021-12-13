const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("./swagger-doc/api-doc.json");
const dotenv = require("dotenv");
const loginRoutes = require("./routes/loginRoutes");
dotenv.config();
/**
 * ENV
 */

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use("/api/v1", loginRoutes);

module.exports = app;
