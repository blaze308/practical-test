const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");

const user = process.env.PGUSER;
const host = process.env.PGHOST;
const password = process.env.PGPASSWORD;
const db = process.env.PGDATABASE;
const port = process.env.PGPORT;

let pool;
const connectDb = async () => {
	try {
		pool = new Pool({
			user: user,
			host: host,
			password: password,
			database: db,
			port: port,
		});

		await pool.connect();
		console.log("db connected");
		// await pool.end();
	} catch (error) {
		console.log(error);
	}
};

connectDb();

const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		pool.query(
			"SELECT * FROM teller WHERE username= $1;",
			[username],
			async (error, results) => {
				if (error) {
					console.log(error);
					res.status(500).json({ message: "Error during login" });
				} else {
					if (results.rows.length > 0) {
						console.log(results[0]);
						const hashedPassword = results.rows[0].password;

						const passwordMatch = await bcrypt.compare(
							password,
							hashedPassword
						);

						if (passwordMatch) {
							const teller_id = results.rows[0].teller_id;

							const token = jwt.sign({ teller_id }, process.env.JWT_SECRET, {
								expiresIn: "1h",
							});

							res.status(200).json({ message: "Login successful", token });
						} else {
							res.status(401).json({ message: "Invalid credentials" });
						}
					} else {
						res.status(401).json({ message: "Invalid credentials" });
					}
				}
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const fetch_customer_info = async (req, res) => {
	try {
		const { customer_id } = req.body;

		const sql = `
		SELECT
			c.customer_id,
			c.firstname,
			c.lastname,
			a.balance,
			c.phone_number,
			c.city
		FROM
			customer c
		JOIN
			account a
		ON
			c.customer_id = a.customer_id
		WHERE
			c.customer_id = $1;
	  `;

		pool.query(sql, [customer_id], (error, results) => {
			if (error) {
				console.log(error);
				res.status(500).json({ message: "Error fetching customer info" });
			} else {
				res.status(200).json(results.rows);
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};

const payment = async (req, res) => {
	try {
		const { amount, teller_id, account_number } = req.body;
		const time_of_deposit = Date.now();
		const transaction_id = crypto.randomBytes(16).toString("hex");
		const sql =
			"INSERT INTO transactions (transaction_id, account_number, transaction_type, amount, transaction_date, teller_id) VALUES ($1, $2, $3, $4, $5, $6)";

		const values = [
			transaction_id,
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
					"UPDATE account SET balance = balance + $1 WHERE account_number = $2";
				const update_balance_values = [amount, account_number];
				pool.query(balance_sql, update_balance_values, (error, results) => {
					if (error) {
						console.log(error);
						res.status(500).json({ message: "Error updating account balance" });
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
		const transaction_id = crypto.randomBytes(16).toString("hex");
		const sql =
			"INSERT INTO transactions (transaction_id, account_number, transaction_type, amount, transaction_date, teller_id) VALUES ($1, $2, $3, $4, $5, $6)";

		const values = [
			transaction_id,
			account_number,
			"withdrawal",
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
					"UPDATE account SET balance = balance - $1 WHERE account_number = $2";
				const update_balance_values = [amount, account_number];
				pool.query(balance_sql, update_balance_values, (error, results) => {
					if (error) {
						console.log(error);
						res.status(500).json({ message: "Error updating account balance" });
					}
				});
				res.status(200).json({ message: "Withdrawal successful" });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
};
const fetch_report = async (req, res) => {
	const { teller_id } = req.body;

	try {
		const sql = `	
		SELECT
		t.transaction_id,
		t.account_number,
		t.transaction_type,
		t.amount,
		t.transaction_date
		FROM
		transactions t
		JOIN
		teller tl ON t.teller_id = tl.teller_id
		WHERE
		t.teller_id = $1
		`;
		pool.query(sql, [teller_id], (error, results) => {
			if (error) {
				console.log(error);
				res.status(500).json({ error: "Internal Server Error" });
			} else {
				res.status(200).json(results.rows);
			}
		});
	} catch (error) {
		console.log({ error: error });
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	login,
	fetch_report,
	payment,
	withdraw,
	fetch_customer_info,
};
