const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SocietySchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter name of society"],
		unique: true,
		trim: true,
	},
	image: {
		type: String,
		default:
			"https://res.cloudinary.com/abhistrike/image/upload/v1636012563/3cf67b33712ea3693eabf1c702156c9d_n6tnhk.jpg",
	},
	handle: {
		type: String,
		required: [true, "Please enter handle for society"],
		unique: true,
	},
	tokens: [{ type: String }],
	password: {
		type: String,
		required: [true, "Please enter password"],
	},
	events: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
	],
});

SocietySchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

SocietySchema.pre("save", async function (next) {
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

const Society = mongoose.model("Society", SocietySchema);

module.exports = Society;
