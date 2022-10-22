const express = require("express");
const Eureka = require('eureka-js-client').Eureka;
const eurekaHelper = require("./eurekaHelper").registerWithEureka;
const app = express();

app.get("/", (req, res) => {
  res.send("This is my express app: Your IP address is: " + req.socket.remoteAddress);
});



app.listen(5000, () => {
  eurekaHelper("myNodeApp", 5000);
  console.log("listening on port: " + 5000);
})