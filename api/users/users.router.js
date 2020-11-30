const router = require("express").Router();

const user = require("./users.controller");

router.post("/registration", user.createUser);

router.post("/login", user.login);

module.exports = router;