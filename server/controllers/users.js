const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const sendMail = require('../utils').sendMail;
const generatePassword = require('../utils').generatePassword;
const ObjectId = mongoose.Types.ObjectId;

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    // Create new user in database
    add: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const payload = req.decoded;
                if (payload && payload.role === "ADMINISTRATOR") {
                    const { username, email, role } = req.body;
                    const password = generatePassword();
                    const user = new User({ username, password, email, role });

                    user.save((err, user) => {
                        if (!err) {
                            // Send password by mail to user
                            sendMail(user.email,
                                "Solar-Hub - Réception de votre mot de passe",
                                `Bonjour, voici les informations de votre compte sur Solar-Hub :\nNom de compte : ${user.username}\nMot de passe : ${password}\n`
                            )

                            result.status = status;
                            result.result = user;
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

    // change user information
    edit: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const userId = req.params.id;
                const { username, password, email } = req.body;
                User.findOne({ _id: new ObjectId(userId) }, (err, user) => {
                    if (!err && user) {
                        if (username && user.username != username) {
                            user.username = username;
                        }
                        if (email && user.email != email) {
                            user.email = email;
                        }
                        if (password) {
                            user.password = password;
                        }
                        user.save((err, user) => {
                            if (!err) {
                                result.status = status;
                                result.result = user;
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

    // Authentication 
    login: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const { email, password } = req.body;
                User.findOne({ email: email }, (err, user) => {
                    if (!err && user) {
                        // compare password
                        bcrypt.compare(password, user.password).then(match => {
                            if (match) {

                                // create token
                                const payload = { user: user.username, role: user.role };
                                const options = { expiresIn: '1d' };
                                const secret = process.env.JWT_SECRET;
                                const token = jwt.sign(payload, secret, options);

                                result.token = token;
                                result.status = status;
                                result.result = user;
                            } else {
                                status = 401;
                                result.status = status;
                                result.error = 'Authentication error';
                            }
                            res.status(status).send(result);
                        }).catch(err => {
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        })
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }
                })
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },

    // Get all users
    getAll: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const payload = req.decoded;
                if (payload && payload.role === "ADMINISTRATOR") {
                    User.find({}, (err, users) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = users;
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

    // Generate a new random password, modifies it in the database and send an email to the user.
    forgotPassword: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const { email } = req.body;
                const password = generatePassword();
                User.findOne({ email: email }, (err, user) => {
                    if (!err && user) {
                        user.password = password;
                        user.save((err, user) => {
                            if (!err) {
                                // Send password by mail to user
                                sendMail(user.email,
                                    "Solar-Hub - Mot de passe oublié",
                                    `Bonjour, le mot de passe de votre compte Solar-Hub a bien été modifié.\nVoici le nouveau : ${password}`
                                )
                                result.status = status;
                                result.result = user;
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

    // change role of user (available only for admin)
    changeRole: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const payload = req.decoded;
                if (payload && payload.role === "ADMINISTRATOR") {
                    const userId = req.params.id;
                    const { role } = req.body;
                    User.findOne({ _id: new ObjectId(userId) }, (err, user) => {
                        if (!err && user) {
                            user.role = role;
                            user.save((err, user) => {
                                if (!err) {
                                    result.status = status;
                                    result.result = user;
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
                }
            } else {
                result = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    }
}