const devices = require('../controllers/devices');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
    router.route('/devices')
        .post(validateToken, devices.add) // add new device
        .get(validateToken, devices.getAll); // get all

    router.route('/device/remove/:id')
        .post(validateToken, devices.removeDevice);

    router.route('/devices/:id')
        .get(validateToken, devices.getInstaller) // get all devices for which the installler is responsible

    router.route('/devices/user/:id')
        .get(validateToken, devices.getUser) // get all devices for a user

    router.route('/device/:id/addIntervention')
        .post(validateToken, devices.addIntervention) // add an intervention to the device's intervention array


    router.route('/device/:id/removeIntervention/:interventionId')
        .post(validateToken, devices.removeIntervention) // remove an intervention to the device's intervention array

    router.route('/device/:id/state')
        .post(validateToken, devices.changeState) // change device's state (On to Off <=> Off to On)
};