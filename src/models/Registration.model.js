const mongoose = require("mongoose");

const RegistrationSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Event",
		},
		society: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Society",
		},
	},
	{
		timestamps: true,
	}
);

const Registration = mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;
