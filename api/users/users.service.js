const pool = require("../../db/db.js");

module.exports = {
  create: (device_id, data, status, callBack) => {
    pool.query(
      `INSERT INTO users(device_id, firstName, lastName, email, password, status) 
       VALUES(?, ?, ?, ?, ?, ?)`,
      [
        device_id,
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        status
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByDeviceId: (device_id, callBack) => {
    pool.query(
      `SELECT * FROM users WHERE device_id = ?`,
      [device_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateStatusRest: (status, restriction_exp, device_id, callBack) => {
    pool.query(
      `UPDATE users SET status = ?, restriction_exp = ?
       WHERE device_id = ?`,
      [
        status,
        restriction_exp,
        device_id
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  }
}