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
	image: {
		type: String,
		default:
			"https://res.cloudinary.com/abhistrike/image/upload/v1636012563/3cf67b33712ea3693eabf1c702156c9d_n6tnhk.jpg",
	},
	location: {
		type: String,
		required: true,
	},
	society: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Society",
		required: true,
	},
	speakers: [
		{
			type: Object,
		},
	],
	contactDetails: {
		type: Object,
		required: true,
	},
	dateAndTime: {
		type: Date,
		default: Date.now(),
		required: true,
	},
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
