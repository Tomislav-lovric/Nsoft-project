const { limits, getLimits, ticket, getTickets } = require("./ticket.service");
const { getUserByDeviceId, updateStatusRest } = require("../users/users.service");
const { v4: uuidv4 } = require('uuid');

let d = new Date();

module.exports = {
    limits: (req, res) => {
        let body = req.body;
        getLimits((err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error"
                });
            }
            if (!results) {
                return res.status(500).json({
                    message: "Error"
                });
            }
            /*  if user enters wrong value of something or doesn't enter anything, set value of that property to be as it already was
                (or we could also just return err msg to the user telling him that he entered the wrong value (or didn't enter anythig) and he should try again) */
            if (body.time_duration == null || isNaN(body.time_duration) || body.time_duration > 86400 || body.time_duration < 300) {
                body.time_duration = results.time_duration;
            }
            if (body.stake_limit == null || isNaN(body.stake_limit) || body.stake_limit > 10000000 || body.stake_limit < 1) {
                body.stake_limit = results.stake_limit;
            }
            if (body.hot_percentage == null || isNaN(body.hot_percentage) || body.hot_percentage > 100 || body.hot_percentage < 1) {
                body.hot_percentage = results.hot_percentage;
            }
            if (body.restriction_expires == null || isNaN(body.restriction_expires) ||  body.restriction_expires < 0) {
                body.restriction_expires = results.restriction_expires;
            }
            limits(body, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        message: "Error"
                    });
                }
                return res.status(200).json({
                    message: "Stake limits have been updated!"
                });
            });
        });
    },
    checkLimits: (req, res) => {
        getLimits((err, results) => {
            if (err) {
                console.log(err);
            }
            return res.status(200).json({
                limits: results
            });
        });
    },
    newTicket: (req, res) => {
        const body = req.body;
        const id = uuidv4();
        body.stake = parseFloat(body.stake);

        const countDecimals = function (value) { //check number of decimals in stake
            if(Math.floor(value) === value) return 0;
            return value.toString().split(".")[1].length || 0;
        }
        
        if(isNaN(body.stake) || body.stake <= 0 || countDecimals(body.stake) > 2) {
            return res.json({
                message: "Stake has to be a number, it has to be higher than 0 and it can't have more than 2 decimals!"
            });
        }
        let sumStake = body.stake;
        getLimits((err, results) => {
            if (err) {
                console.log(err);
            }
            //get all properties and their values from limiter so they can be used later for checks
            const time_duration = results.time_duration;
            const stake_limit = results.stake_limit;
            const hot_percentage = results.hot_percentage;
            const restriction_expires = results.restriction_expires;
            const hot_limit = (hot_percentage / 100) * stake_limit;
            getUserByDeviceId(body.device_id, (err, results) => {
                if (err) {
                    console.log(err);
                }
                if (!results) {
                    res.json({
                        message: "Invalid device_id"
                    });
                }
                console.log(results);
                if (results.status === "BLOCKED") {
                    if (results.restriction_exp < d) {
                        getTickets(body.device_id, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].date_exp > d) {
                                    sumStake += results[i].stake;
                                }
                            }
                            let status;
                            if (sumStake >= stake_limit) {
                                status = "BLOCKED";
                                const restricion_exp = new Date();
                                restricion_exp.setSeconds(restricion_exp.getSeconds() + restriction_expires); //add num of seconds set in restriction ticket limit to the current datetime which we will be sending to the db
                                updateStatusRest(status, restricion_exp, body.device_id, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    return res.status(200).json({
                                        status: status
                                    });
                                });
                            } else if (sumStake >= hot_limit) {
                                status = "HOT";
                                const time_dur = new Date();
                                time_dur.setSeconds(time_dur.getSeconds() + time_duration);
                                ticket(id, body, time_dur, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    updateStatusRest(status, null, body.device_id, (err, results) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        return res.status(200).json({
                                            status: status
                                        });
                                    });
                                });
                            } else {
                                status = "OK";
                                const time_dur = new Date();
                                time_dur.setSeconds(time_dur.getSeconds() + time_duration);
                                ticket(id, body, time_dur, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    updateStatusRest(status, null, body.device_id, (err, results) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        return res.status(200).json({
                                            status: status
                                        });
                                    });
                                });
                            }
                        });
                    } else {
                        res.status(200).json({
                            status: results.status
                        });
                    }
                } else {
                    getTickets(body.device_id, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].date_exp > d) {
                                sumStake += results[i].stake;
                            }
                        }
                        let status;
                        if (sumStake >= stake_limit) {
                            status = "BLOCKED";
                            const restricion_exp = new Date();
                            restricion_exp.setSeconds(restricion_exp.getSeconds() + restriction_expires);
                            updateStatusRest(status, restricion_exp, body.device_id, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                return res.status(200).json({
                                    status: status
                                });
                            });
                        } else if (sumStake >= hot_limit) {
                            status = "HOT";
                            const time_dur = new Date();
                            time_dur.setSeconds(time_dur.getSeconds() + time_duration);
                            ticket(id, body, time_dur, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                updateStatusRest(status, null, body.device_id, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    return res.status(200).json({
                                        status: status
                                    });
                                });
                            });
                        } else {
                            status = "OK";
                            const time_dur = new Date();
                            time_dur.setSeconds(time_dur.getSeconds() + time_duration);
                            ticket(id, body, time_dur, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                updateStatusRest(status, null, body.device_id, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    return res.status(200).json({
                                        status: status
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    }
}