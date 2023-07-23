const express = require("express");
const route = require("./route");

const app = express();
app.use(express.json());

const PORT = 8001;
app.use("/apis", route);

app.listen(PORT, function () {
  console.log(`app is running on ${PORT}`);
});

module.exports = app;
