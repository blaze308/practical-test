const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization");

		if (!token) return res.status(401).json({ message: "no token" });

		const verified = jwt.verify(token, JWT_SECRET);
		if (!verified) return res.status(401).json({ message: "auth failed" });

		req.user = verified;
		req.token = token;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

module.exports = auth;
