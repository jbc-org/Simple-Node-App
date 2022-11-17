'use strict'

const Eureka = require('eureka-js-client').Eureka;
const os = require("os");
var hostname = os.hostname();
const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || 'obscure-gorge-75280.herokuapp.com' || 'localhost');
const eurekaPort = 80;


exports.registerWithEureka = function(appName, PORT) {

    let ipAddr = "";
    var http = require('http');

    var options = {
        host: 'ipinfo.io',
        path: '/ip'

    };

    let callback = function(response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            ipAddr = str;
            registerAppWithEureka()
        });
    }

    http.request(options, callback).end();

    function registerAppWithEureka() {
        const client = new Eureka({
            instance: {
                app: appName,
                instanceId: `${ipAddr}:${appName}:${PORT}`,
                hostName: `${ipAddr}`,
                ipAddr: ipAddr,
                statusPageUrl: `http://${ipAddr}:${PORT}`,
                healthCheckUrl: `http://${ipAddr}:${PORT}/health`,
                port: {
                    '$': PORT,
                    '@enabled': 'true',
                },
                vipAddress: appName,
                dataCenterInfo: {
                    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                    name: 'MyOwn',
                },
            },
            //retry 10 time for 3 minute 20 seconds.
            eureka: {
                host: eurekaHost,
                port: eurekaPort,
                servicePath: '/eureka/apps/',
                maxRetries: 10,
                requestRetryDelay: 2000,
            },
        })

        client.logger.level('debug')

        client.start( error => {
            console.log(error || "user service registered")
        });



        function exitHandler(options, exitCode) {
            if (options.cleanup) {
            }
            if (exitCode || exitCode === 0) console.log(exitCode);
            if (options.exit) {
                client.stop();
            }
        }

        client.on('deregistered', () => {
            process.exit();
            console.log('after deregistered');
        })

        client.on('started', () => {
            console.log("eureka host  " + eurekaHost);
        })

        process.on('SIGINT', exitHandler.bind(null, {exit:true}));
    }
};