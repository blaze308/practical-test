const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

// const mysql = require("mysql");
// const options = {
// 	connectionLimit: 10,
// 	password: process.env.DB_PASS,
// 	user: process.env.DB_USER,
// 	database: process.env.MYSQL_DB,
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	createDatabaseTable: true,
// };

// const pool = mysql.createPool(options);

// pool.getConnection(function (err, connection) {
// 	if (err) {
// 		console.error("Error occurred while connecting to the database:", err);
// 	} else {
// 		console.log("Connection created with MySQL successfully");
// 		connection.release();
// 	}
// });

app.use("/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`server running on ${PORT}`);
});
