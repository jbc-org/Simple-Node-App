'use strict'

const Eureka = require('eureka-js-client').Eureka;
const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || 'obscure-gorge-75280.herokuapp.com' || 'localhost');
const eurekaPort = 80;
// let hostName = (process.env.HOSTNAME || 'localhost')
let ipAddr = (process.env.HOST_IP_ADDRESS || '127.0.0.1');

exports.registerWithEureka = function(appName, PORT) {

    // TODO: According to stack overflow, we shouldn't be getting the IP address from DNS as it might be cached.
    //  Need to use a different method to obtain this.'
    //Finds and sets Hostname/IP address
    // require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    //     hostName = add;
    // })

    console.dir(process.env);

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
};