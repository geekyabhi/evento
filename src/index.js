const express = require("express");
const connectDB = require("./db/connectDB");
require("colors");
require("dotenv").config({ path: "./dev.env" });
const morgan = require("morgan");

const PORT = process.env.PORT || 5000;
const app = express();

connectDB()
	.then((connection) => {
		console.log(`Databse connected at host ${connection.host}`.cyan);
		app.get("/", (req, res) => {
			res.send({
				message: `Server is running on port ${PORT}`,
			});
		});
		const apis = require("./apis/api");
		console.log(`All apis connected`.magenta);
		app.use("/api", apis());
	})
	.catch((e) => {
		console.log(`Database could not be connnected ${e}`.red);
		process.exit(1);
	});

app.use(express.json());
app.use(morgan("dev"));

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`.yellow);
});
