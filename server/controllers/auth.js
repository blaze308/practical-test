const bcrypt = require("bcrypt");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const options = {
	connectionLimit: 10,
	password: process.env.DB_PASS,
	user: process.env.DB_USER,
	database: process.env.MYSQL_DB,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	createDatabaseTable: true,
};

const pool = mysql.createPool(options);

pool.getConnection(function (err, connection) {
	if (err) {
		console.error("Error occurred while connecting to the database:", err);
	} else {
		console.log("Connection created with MySQL successfully");
		connection.release();
	}
});

const signup = async (req, res) => {};

const customer_login = async (req, res) => {
	try {
		const { username, password } = req.body;

		pool.query(
			"SELECT * FROM customer WHERE username = ?",
			[username],
			async (error, results) => {
				if (error) {
					console.error(error);
					res.status(500).json({ message: "Error during login" });
				} else {
					if (results.length > 0) {
						console.log(results[0]);
						const hashedPassword = results[0].password;

						const passwordMatch = await bcrypt.compare(
							password,
							hashedPassword
						);

						if (passwordMatch) {
							const customer_id = results[0].customer_id;

							const token = jwt.sign({ customer_id }, process.env.JWT_SECRET, {
								expiresIn: "1m",
							});

							res.status(200).json({ message: "Login successful", token });
						} else {
							res.status(401).json({ message: "Invalid username or password" });
						}
					} else {
						res.status(401).json({ message: "Invalid username or password" });
					}
				}
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};
const teller_login = async (req, res) => {
	try {
		const { username, password } = req.body;

		pool.query(
			"SELECT * FROM teller WHERE username = ?",
			[username],
			async (error, results) => {
				if (error) {
					console.error(error);
					res.status(500).json({ message: "Error during login" });
				} else {
					if (results.length > 0) {
						console.log(results[0]);
						const hashedPassword = results[0].password;

						const passwordMatch = await bcrypt.compare(
							password,
							hashedPassword
						);

						if (passwordMatch) {
							const teller_id = results[0].teller_id;

							const token = jwt.sign({ teller_id }, process.env.JWT_SECRET, {
								expiresIn: "1h",
							});

							res
								.status(200)
								.json({ message: "Login successful", token, teller_id });
						} else {
							res.status(401).json({ message: "Invalid username or password" });
						}
					} else {
						res.status(401).json({ message: "Invalid username or password" });
					}
				}
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const profile = async (req, res) => {
	try {
		// const { customer_id } = req.user;
		pool.query(
			`SELECT
   		 	c.firstname,
    		c.lastname,
		    c.phone_number,
		    b.branch_name,
		    b.branch_city,
		    a.account_number,
		    a.account_type,
		    a.account_status
			FROM
			    customer c
			JOIN
			    account a ON c.customer_id = a.customer_id
			JOIN
			    branch b ON a.branch_id = b.branch_id`,
			(error, results) => {
				if (error) {
					console.error(error);
					res.status(500).json({ message: "Error fetching profile" });
				} else if (results.length > 0) {
					const profileData = results[0];
					res.status(200).json(profileData);
				} else {
					res.status(404).json({ message: "Profile not found" });
				}
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const validate = async (req, res) => {
	try {
		// const token = req.header(SECRET_KEY);
		const { token } = req.body;
		if (!token) {
			res.status(500).json({ message: error.message });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const alter = async (req, res) => {
	try {
		const { password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		pool.query(
			"update customer set password = ? where customer_id = ?",
			[hashedPassword, "C00002"],
			(error, results) => {
				if (error) {
					console.log(error);
					res.status(500).json({ message: "Error updating password" });
				} else {
					res.status(200).json({ message: "Password updated successfully" });
				}
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const payment = async (req, res) => {
	try {
		const { amount, teller_id, account_number } = req.body;
		const time_of_deposit = Date.now();
		const sql =
			"INSERT INTO transactions (account_number, transaction_type, amount, transaction_date, teller_id) VALUES (?, ?, ?, ?, ?)";

		const values = [
			account_number,
			"deposit",
			amount,
			new Date(time_of_deposit),
			teller_id,
		];

		pool.query(sql, values, (error, results) => {
			if (error) {
				console.log(error);
				res.status(500).json({ message: "Error during payment" });
			} else {
				const balance_sql =
					"UPDATE account SET account_balance = account_balance + ? WHERE account_number = ?";
				const update_balance_values = [amount, account_number];
				pool.query(balance_sql, update_balance_values, (error, results) => {
					if (error) {
						// console.log(error);
						// res.status(500).json({ message: "Error updating account balance" });
					} else {
						// console.log(results);
						// res
						// 	.status(200)
						// 	.json({ message: "account balance updated successfully" });
					}
				});
				res.status(200).json({ message: "Payment successful" });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const withdraw = async (req, res) => {
	try {
		const { amount, teller_id, account_number } = req.body;
		const time_of_deposit = Date.now();

		const balance_sql =
			"UPDATE account SET account_balance = account_balance - ? WHERE account_number = ?";
		const update_balance_values = [amount, account_number];

		pool.query(balance_sql, update_balance_values, (error, results) => {
			if (error) {
				console.log(error);
				res.status(500).json({ message: "Error updating account balance" });
			} else {
				const sql =
					"INSERT INTO transactions (account_number, transaction_type, amount, transaction_date, teller_id) VALUES (?, ?, ?, ?, ?)";

				const values = [
					account_number,
					"deposit",
					amount,
					new Date(time_of_deposit),
					teller_id,
				];

				pool.query(sql, values, (error, results) => {
					if (error) {
						console.log(error);
						res.status(500).json({ message: "Error updating account balance" });
					} else {
						console.log(results);
						res
							.status(200)
							.json({ message: "account balance updated successfully" });
					}
				});
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const report = async (req, res) => {
	try {
		const teller_id = req.params.teller_id;
		const sql = `SELECT *
		FROM transactions
		WHERE DATE(transaction_date) = CURDATE()
		AND TIME(transaction_date) <= '18:00:00'
		AND teller_id = ? `;

		pool.query(sql, [teller_id], (error, results) => {
			if (error) {
				// console.log(error);
				res.status(500).json({ message: "Error fetching daily update" });
			} else {
				res.status(200).json(results);
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

module.exports = {
	signup,
	customer_login,
	teller_login,
	alter,
	profile,
	validate,
	payment,
	withdraw,
	report,
};
