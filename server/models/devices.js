const mongoose = require('mongoose');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    location: {
        type: 'Object',
        required: true,
    },
    firstStartUp: {
        type: 'Date',
        required: true,
        trim: true
    },
    administrator: {
        type: 'ObjectId',
        required: true
    },
    owner: {
        type: 'ObjectId',
        trim: true
    },
    interventions: [{
        description: {
            type: 'String',
            required: true,
            trim: true
        },
        date: {
            type: 'Date',
            required: true,
            trim: true
        },
        technician: {
            type: 'ObjectId',
            required: true
        }
    }],
    data: {
        time: {
            type: 'String',
            trim: true
        },
        panel: {
            type: 'String',
            trim: true
        },
        load: {
            type: 'Number',
        },
        ampe: {
            type: 'Number',
        },
        watt: {
            type: 'Number',
        },
        batteryCurrent: {
            type: 'Number',
        },
        batterySOC: {
            type: 'Number',
        },
        loadSwitch: {
            type: 'String',
            trim: true
        },
        panelM: {
            min: {
                type: 'Number',
            },
            max: {
                type: 'Number',
            }
        },
        battery: {
            min: {
                type: 'Number',
            },
            max: {
                type: 'Number',
            }
        },
        consumed: {
            day: {
                type: 'Number'
            },
            mon: {
                type: 'Number'
            },
            year: {
                type: 'Number'
            },
            total: {
                type: 'Number'
            }
        },
        generated: {
            day: {
                type: 'Number'
            },
            mon: {
                type: 'Number'
            },
            year: {
                type: 'Number'
            },
            total: {
                type: 'Number'
            }
        },
        CO2Reduction: {
            type: 'Number'
        },
        battVolt: {
            type: 'Number'
        },
        battTemp: {
            type: 'Number'
        },
        chargerCharging: {
            type: 'String',
            trim: true
        }
    }

})

module.exports = mongoose.model('Device', deviceSchema);