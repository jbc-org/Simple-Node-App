const fs = require('fs');
const http = require('http');
const https = require('https');
const keyPath = 'certs/key.pem';
const certPath = 'certs/cert.pem';

const privateKey = fs.readFileSync(keyPath, 'utf-8');
const certificate = fs.readFileSync(certPath, 'utf-8');

const credentials = {key: privateKey, cert: certificate}
const express = require("express");
const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const eurekaHelper = require("./eurekaHelper").registerWithEureka;

app.get("/", (req, res) => {
  res.send("zThis is my express app: Your IP address is: " + req.socket.remoteAddress);
});

const port = process.env.PORT || 80;
const securePort = process.env.SECUREPORT || 443;

// app.listen(port, () => {
//   eurekaHelper("myNodeApp", port);
//   console.log("listening on port: " + port);
// })
httpServer.listen(port);
eurekaHelper("myNodeApp", port);
httpsServer.listen(securePort);
eurekaHelper("secureMyNodeApp", securePort);
