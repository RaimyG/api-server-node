const users = require('../controllers/users');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
    router.route('/users')
        .post(validateToken, users.add) // add new user
        .get(validateToken, users.getAll); // get all users

    router.route('/user/forgotPassword')
        .post(users.forgotPassword); // Change password

    router.route('/user/edit/:id')
        .post(validateToken, users.edit); // change user information

    router.route('/user/role/:id')
        .post(validateToken, users.changeRole); // change user information

    router.route('/login')
        .post(users.login); //login

};