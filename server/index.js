const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`server running on ${PORT}`);
});
