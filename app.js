const express = require("express");
const Eureka = require('eureka-js-client').Eureka;
// const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || '127.0.0.1');
// const eurekaPort = 8761;
// const hostName = (process.env.HOSTNAME || 'localhost')
// const ipAddr = '172.0.0.1';
const eurekaHelper = require("./eurekaHelper").registerWithEureka;
const app = express();

app.get("/", (req, res) => {
  res.send("This is my express app: Your IP address is: " + req.socket.remoteAddress);
});



app.listen(5000, () => {
  // console.dir(eurekaHelper.registerWithEureka;
  // eurekaHelper.registerWithEureka("myNodeApp", 5000);
  eurekaHelper("myNodeApp", 5000);
  console.log("listening on port: " + 5000);
})