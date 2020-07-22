const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Device = require('../models/devices');
const ObjectId = mongoose.Types.ObjectId;

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    // Create new device in database
    add: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const payload = req.decoded;
                if (payload && (payload.role === "ADMINISTRATOR" || payload.role === "INSTALLER")) {
                    const { name, location, administrator, owner } = req.body;
                    const device = new Device({ name, location, administrator, owner });
                    device.firstStartUp = Date.now(); // first startUp is when the device is added
                    // Generate some data for development..
                    device.data.time = `${Math.floor((Math.random() * 31) + 1)}-${Math.floor((Math.random() * 12) + 1)}-2020 ${Math.floor((Math.random() * 24) + 1)}:${Math.floor((Math.random() * 59) + 1)}:${Math.floor((Math.random() * 99) + 1)}`
                    device.data.panel = `${Math.floor((Math.random() * 100) + 1)}.${Math.floor((Math.random() * 99) + 1)} - ${Math.floor((Math.random() * 100) + 1)}.${Math.floor((Math.random() * 99) + 1)} - ${Math.floor((Math.random() * 100) + 1)}.${Math.floor((Math.random() * 99) + 1)}`
                    device.data.load = `${Math.floor((Math.random() * 100) + 1)}`
                    device.data.ampe = `${Math.floor((Math.random() * 1000) + 1)}`
                    device.data.watt = `${Math.floor((Math.random() * 800) + 1)}`
                    device.data.batteryCurrent = `${Math.floor((Math.random() * 100) + 1)}`
                    device.data.batterySOC = `${Math.floor((Math.random() * 100) + 1)}`
                    device.data.loadSwitch = `${(Math.random() >= 0.5) ? "ON" : "OFF"}`
                    device.data.panelM.min = `${Math.floor((Math.random() * 10) + 1)}`
                    device.data.panelM.max = `${Math.floor((Math.random() * 100) + 1)}`
                    device.data.battery.min = `${Math.floor((Math.random() * 10) + 1)}`
                    device.data.battery.max = `${Math.floor((Math.random() * 100) + 1)}`
                    device.data.consumed.day = `${Math.floor((Math.random() * 1000) + 1)}`
                    device.data.consumed.mon = `${Math.floor((Math.random() * 10000) + 1)}`
                    device.data.consumed.year = `${Math.floor((Math.random() * 100000) + 1)}`
                    device.data.consumed.total = device.data.consumed.day + device.data.consumed.mon + device.data.consumed.year
                    device.data.generated.day = `${Math.floor((Math.random() * 1000) + 1)}`
                    device.data.generated.mon = `${Math.floor((Math.random() * 10000) + 1)}`
                    device.data.generated.year = `${Math.floor((Math.random() * 100000) + 1)}`
                    device.data.generated.total = device.data.consumed.day + device.data.consumed.mon + device.data.consumed.year
                    device.data.CO2Reduction = `${Math.floor((Math.random() * 1000) + 1)}`
                    device.data.battVolt = `${Math.floor((Math.random() * 1000) + 1)}`
                    device.data.battTemp = `${Math.floor((Math.random() * 80) + 1)}`
                    device.data.chargerCharging = `${(Math.random() >= 0.5) ? "ON" : "OFF"}`
                    device.save((err, device) => {
                        if (!err) {
                            result.status = status;
                            result.result = device;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                    res.status(status).send(result);
                }

            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // Get all devices
    getAll: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const payload = req.decoded;
                if (payload && (payload.role === "ADMINISTRATOR")) {
                    Device.find({}, (err, devices) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = devices;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                    res.status(status).send(result);
                }
            } else {
                result = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // Return all devices for installer 
    getInstaller: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const administratorId = req.params.id;
                Device.find({ administrator: new ObjectId(administratorId) }, (err, devices) => {
                    if (!err) {
                        result.status = status;
                        result.error = err;
                        result.result = devices;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // Return all devices for user 
    getUser: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const userId = req.params.id;
                Device.find({ owner: new ObjectId(userId) }, (err, devices) => {
                    if (!err) {
                        result.status = status;
                        result.error = err;
                        result.result = devices;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // add an intervention to the device's intervention array
    addIntervention: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const deviceId = req.params.id;
                const { intervention } = req.body;
                const payload = req.decoded;
                if (payload && (payload.role === "ADMINISTRATOR" || payload.role === "INSTALLER")) {
                    Device.findOne({ _id: new ObjectId(deviceId) }, (err, device) => {
                        if (!err && device) {
                            device.interventions.push(intervention);
                            device.save((err, device) => {
                                if (!err) {
                                    result.status = status;
                                    result.result = device;
                                } else {
                                    status = 500;
                                    result.status = status;
                                    result.error = err;
                                }
                                res.status(status).send(result);
                            });
                        } else {
                            status = 404;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        }
                    })
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                    res.status(status).send(result);
                }

            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },


    // remove an intervention to the device's intervention array
    removeIntervention: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const deviceId = req.params.id;
                const interventionId = req.params.interventionId;
                const { intervention } = req.body;
                const payload = req.decoded;
                if (payload && (payload.role === "ADMINISTRATOR" || payload.role === "INSTALLER")) {
                    Device.findOne({ _id: new ObjectId(deviceId) }, (err, device) => {
                        if (!err && device) {
                            // get index of object with interventionId
                            var removeIndex = device.interventions.map(function (intervention) { return intervention._id; }).indexOf(interventionId);
                            // remove object
                            device.interventions.splice(removeIndex, 1);

                            device.save((err, device) => {
                                if (!err) {
                                    result.status = status;
                                    result.result = device;
                                } else {
                                    status = 500;
                                    result.status = status;
                                    result.error = err;
                                }
                                res.status(status).send(result);
                            });
                        } else {
                            status = 404;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        }
                    })
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                    res.status(status).send(result);
                }

            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // change state of device
    changeState: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const deviceId = req.params.id;
                Device.findOne({ _id: new ObjectId(deviceId) }, (err, device) => {
                    if (!err && device) {
                        const actualState = device.data.loadSwitch;
                        if (actualState == "ON") {
                            device.data.loadSwitch = "OFF";
                        } else {
                            device.data.loadSwitch = "ON";
                        }
                        device.save((err, device) => {
                            if (!err) {
                                result.status = status;
                                result.result = device;
                            } else {
                                status = 500;
                                result.status = status;
                                result.error = err;
                            }
                            res.status(status).send(result);
                        });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }
                })
            } else {
                result = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // remove a device from bdd
    removeDevice: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const deviceId = req.params.id;
                const payload = req.decoded;
                if (payload && (payload.role === "ADMINISTRATOR")) {
                    Device.deleteOne({ _id: new ObjectId(deviceId) }, (err, device) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = device;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    })
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                    res.status(status).send(result);
                }
            } else {
                result = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
}