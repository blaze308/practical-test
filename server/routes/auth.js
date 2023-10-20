const express = require("express");

const router = express.Router();
const {
	signup,
	alter,
	profile,
	validate,
	customer_login,
	teller_login,
	payment,
	withdraw,
	report,
} = require("../controllers/auth.js");
const auth = require("../middlewares/auth.js");

router.post("/signup", signup);
router.post("/customer/login", customer_login);
router.get("/customer/profile", auth, profile);

router.post("/teller/login", teller_login);
router.post("/teller/payment", auth, payment);
router.post("/teller/withdraw", auth, withdraw);
router.get("/teller/report/:id", auth, report);

router.post("/alter", alter);
router.post("/validate", validate);

module.exports = router;
