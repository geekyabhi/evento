const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter name of event"],
		trim: true,
	},
	description: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	contactDetails: {
		type: Object,
		required: true,
	},
});

const Society = mongoose.model("Society", SocietySchema);

module.exports = Society;
