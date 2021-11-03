const mongoose = require("mongoose");
require("dotenv").config({ path: "./dev.env" });

const mongodbUri = process.env.MONGODB_URI;

const connectDB = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { connection } = await mongoose.connect(mongodbUri);
			resolve(connection);
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = connectDB;
