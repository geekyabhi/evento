const Event = require("../models/Events.model");

const addEvents = async (req, res) => {
	try {
		const loggedSociety = req.society;
		const { name, description, image, location, dateAndTime } = req.body;
		if (!(name && description && location)) {
			return res.status(400).send({
				success: false,
				error: "Fields missing",
			});
		}
		const { contact } = req.body;
		if (!contact) {
			return res.status(400).send({
				success: false,
				error: "Contact detail missing",
			});
		}
		const { name: contactName, number: contactNumber } = contact;
		if (!(contactName && contactNumber)) {
			return res.status(400).send({
				success: false,
				error: "Contact detail missing",
			});
		}
		const { speakers } = req.body;
		const event = new Event({
			name,
			description,
			image,
			society: loggedSociety._id,
			location,
			dateAndTime,
			contactDetails: contact,
			speakers,
		});
		const savedEvent = await event.save();
		const preEvents = loggedSociety.events;
		loggedSociety.events = [...preEvents, savedEvent];
		await loggedSociety.save();
		res.status(200).send({
			success: true,
			data: savedEvent,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const updateEvents = async (req, res) => {
	try {
		const { id } = req.params;
		const society = req.society;
		const { name, description, image, location, dateAndTime } = req.body;
		const { contact } = req.body;
		const { speakers } = req.body;
		const event = await Event.findById(id).populate("society", [
			"-password",
			"-tokens",
			"-events",
		]);
		if (!event) {
			return res.status(404).send({
				success: false,
				error: "No such event found",
			});
		}
		if (String(event.society._id) !== String(society._id)) {
			return res.status(401).send({
				success: false,
				error: "Not authorized",
			});
		}

		event.name = name || event.name;
		event.description = description || event.description;
		event.image = image || event.image;
		event.location = location || event.location;
		event.dateAndTime = dateAndTime || event.dateAndTime;
		event.contactDetails.name = contact
			? contact.name || event.contactDetails.name
			: event.contactDetails.name;
		event.contactDetails.number = contact
			? contact.number || event.contactDetails.number
			: event.contactDetails.number;
		event.speakers = speakers || event.speakers;

		const savedEvent = await event.save();
		res.status(200).send({
			success: true,
			data: savedEvent,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const deleteEvents = async (req, res) => {
	try {
		const { id } = req.params;
		const society = req.society;
		const event = await Event.findById(id).populate("society", [
			"-password",
			"-tokens",
			"-events",
		]);
		if (!event) {
			return res.status(404).send({
				success: false,
				error: "No such event found",
			});
		}
		if (String(event.society._id) !== String(society._id)) {
			return res.status(401).send({
				success: false,
				error: "Not authorized",
			});
		}
		const preEvents = society.events;
		const newEvents = preEvents.filter(
			(event) => String(event._id) !== String(id)
		);
		society.events = newEvents;
		await society.save();
		await event.remove();
		res.status(200).send({
			success: true,
			data: "Event removed !",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

module.exports = { addEvents, updateEvents, deleteEvents };