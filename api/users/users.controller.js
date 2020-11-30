const { create, getUserByUserEmail } = require("./users.service");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const validateEmail = function (email) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email);
}
const validatePassword = function (pass) {
    const pattern = /^(?=.*[0-9])(?=.*[.,!@#$%^&*])[a-zA-Z0-9.,!@#$%^&*]{8,16}$/;
    return pattern.test(pass);
}
const validateName = function (name) {
    const pattern = /[a-zA-Z]{5,}/
    return pattern.test(name);
}

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        if (validateEmail(body.email) && validateName(body.firstName) && validateName(body.lastName)) {
            getUserByUserEmail(body.email, (err, results) => {
                if (err) {
                    console.log(err);
                }
                if (!results) {
                    if (!validatePassword(body.password) || body.password != body.repeatedPassword) {
                        return res.status(400).json({
                            message: "Invalid password. Password has to have more than 8 and less than 16 characters, it has to contain at least on number and one special character"
                        });
                    } else {
                        const salt = bcrypt.genSaltSync(10);
                        body.password = bcrypt.hashSync(body.password, salt);
                        const device_id = uuidv4();
                        const status = "OK"; //we could also not pass status at all and just set it as null in db as default
                        create(device_id, body, status, (err, results) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({
                                    message: "Database connection errror"
                                });
                            }
                            return res.status(200).json({
                                message: "User created",
                                data: results
                            });
                        });
                    }
                } else {
                    res.json({
                        message: "Invalid data"
                    });
                }
            });
        } else {
            res.status(400).json({
                message: "Invalid data"
            });
        }
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    data: "Invalid email or password"
                });
            }
            const result = bcrypt.compareSync(body.password, results.password);
            if (result) {
                return res.status(200).json({
                    message: "login successfull",
                    deviceId: results.device_id
                });
            } else {
                return res.json({
                    data: "Invalid email or password"
                });
            }
        });
    }
};