const router = require("express").Router();

const ticket = require("./tickets.controller");

router.post("/setlimit", ticket.limits);

router.get("/getlimit", ticket.checkLimits);

router.post("/newticket", ticket.newTicket);

module.exports = router;