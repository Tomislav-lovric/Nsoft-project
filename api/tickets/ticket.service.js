const pool = require("../../db/db");

module.exports = {
    limits: (data, callback) => {
        pool.query(
            `UPDATE stake_limits SET time_duration = ?,	stake_limit = ?, hot_percentage = ?, restriction_expires = ? WHERE id = 1`,
            [
                data.time_duration,
                data.stake_limit,
                data.hot_percentage,
                data.restriction_expires
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
    getLimits: (callback) => {
        pool.query(
            `SELECT * FROM stake_limits WHERE id = 1`,
            [],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
    ticket: (id, data, date_exp, callback) => {
        pool.query(
            `INSERT INTO tickets(id, device_id, stake, date_exp) VALUES(?, ?, ?, ?)`,
            [
                id,
                data.device_id,
                data.stake,
                date_exp
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getTickets: (device_id, callback) => {
        pool.query(
            `SELECT * FROM tickets WHERE device_id = ?`,
            [
                device_id
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        )
    }
}