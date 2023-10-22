const express = require("express");

const router = express.Router();
const {
	login,
	fetch_report,
	payment,
	withdraw,
	fetch_customer_info,
} = require("../controllers/auth.js");
const auth = require("../middlewares/auth.js");

router.post("/teller/login", login);
router.post("/account/customer-info", auth, fetch_customer_info);
router.post("/account/payment", auth, payment);
router.post("/account/withdrawal", auth, withdraw);
router.get("/account/teller-report/:id", auth, fetch_report);

module.exports = router;
