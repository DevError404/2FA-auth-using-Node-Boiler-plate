const dotenv = require("dotenv");
const app = require("./app");
const models = require("./models/index");
dotenv.config();

// // db connection
models.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => {
    console.log("Error in sync!", err);
  });

//SERVER START
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App has started on port ${port}`);
});
