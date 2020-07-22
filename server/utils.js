const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        let result;
        if (authorizationHeader) {
            const token = req.headers.authorization.split(' ')[1]; // Get token in the header
            const options = { expiresIn: '1d' };
            try {
                // Verify the token hasn't expired
                result = jwt.verify(token, process.env.JWT_SECRET, options);

                req.decoded = result;
                next();
            } catch (error) {
                throw new Error(error);
            }
        } else {
            result = {
                error: 'Authentication  error. Token required',
                status: 401
            };
            res.status(401).send(result);
        }
    },

    sendMail: (receiver, subject, message) => {
        // Send password by mail to user
        let transport = nodemailer.createTransport({
            host: 'ssl0.ovh.net',
            port: 465,
            auth: {
                user: process.env.OVH_MAIL,
                pass: process.env.OVH_PASSWD
            }
        });

        const mail = {
            from: 'noreply@remy-gaudru.fr', // Sender address
            to: receiver,         // List of recipients
            subject: subject,
            text: message
            // text: `
            // Bonjour, voici les informations de votre compte sur Solar-Hub :\n
            // Nom de compte : ${user.username}\n
            // Mot de passe : ${password}\n
            // `
        };
        transport.sendMail(mail, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    },

    generatePassword: () => {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};