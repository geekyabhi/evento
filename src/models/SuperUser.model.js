const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Society = require("./Society.model");

const SuperUserSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		tokens: [{ type: String }],
	},
	{
		timestamps: true,
	}
);

SuperUserSchema.methods.matchPassword = async function (enteredPassword) {
	console.log(enteredPassword);
	return await bcrypt.compare(enteredPassword, this.password);
};

SuperUserSchema.pre("save", async function (next) {
	try {
		const user = this;
		if (user.isModified("password")) {
			user.password = await bcrypt.hash(user.password, 10);
		}
		next();
	} catch (e) {
		console.log(`Error occured while hashing password ${e}`);
	}
});

const SuperUser = mongoose.model("SuperUser", SuperUserSchema);

module.exports = SuperUser;
