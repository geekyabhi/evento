const mongoose = require("mongoose");

const SocietySchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter name of society"],
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
	},
	password: {
		type: String,
		required: [true, "Please enter password"],
	},
});

const Society = mongoose.model("Society", SocietySchema);

module.exports = Society;
