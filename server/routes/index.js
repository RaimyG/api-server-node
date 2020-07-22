const users = require('./users');
const devices = require('./devices');

module.exports = (router) => {
    users(router);
    devices(router);
    return router;
}