const { events } = require("../models/Events.model");
const Event = require("../models/Events.model");
const Society = require("../models/Society.model");

const { promisify } = require("util");
var fs = require("fs");
const writeFilePromise = promisify(fs.writeFile);
const ObjectsToCsv = require("objects-to-csv");
const uploadToCloudinary = require("../utils/cloudinaryUploader");

const addEvents = async (req, res) => {
	try {
		const loggedSociety = req.society;
		const { name, description, image, location, dateAndTime, cta } =
			req.body;
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
			cta,
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

const getEvents = async (req, res) => {
	try {
		const society = req.society;
		const societyId = society._id;
		const data = await Event.find({ society: societyId }).populate(
			"registrations"
		);
		if (!data) {
			return res.status(404).send({
				success: false,
				error: "Unable to find events",
			});
		}
		return res.status(200).send({
			success: true,
			data: data,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const getEvent = async (req, res) => {
	try {
		const { id } = req.params;
		const society = req.society;
		const event = await Event.findById(id).populate({
			path: "registrations",
			populate: {
				path: "user",
				select: [
					"-tokens",
					"-password",
					"-registeredIn",
					"-updatedAt",
					"-createdAt",
					"-__v",
				],
			},
		});
		if (!event) {
			return res.status(400).send({
				success: false,
				error: "No such event found",
			});
		}
		if (String(event.society) !== String(society._id)) {
			return res.status(401).send({
				success: false,
				error: "Not authorized",
			});
		}
		return res.status(200).send({
			success: true,
			data: event,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const createExelOfRegistrations = async (req, res) => {
	try {
		const { id } = req.params;
		const society = req.society;
		const event = await Event.findById(id).populate({
			path: "registrations",
			populate: {
				path: "user",
				select: [
					"-tokens",
					"-password",
					"-registeredIn",
					"-updatedAt",
					"-createdAt",
					"-__v",
				],
			},
		});
		if (!event) {
			return res.status(400).send({
				success: false,
				error: "No such event found",
			});
		}
		if (String(event.society) !== String(society._id)) {
			return res.status(401).send({
				success: false,
				error: "Not authorized",
			});
		}
		const newData = [];
		event.registrations.forEach((registration) => {
			let obj = JSON.parse(JSON.stringify(registration.user));
			delete obj["_id"];
			newData.push(obj);
		});

		const csv = new ObjectsToCsv(newData);
		await csv.toDisk(`${event.name}.csv`);

		const path = `${event.name}.csv`;

		const url = await uploadToCloudinary(path);
		return res.status(200).send({
			success: true,
			data: url,
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

module.exports = {
	addEvents,
	updateEvents,
	deleteEvents,
	getEvents,
	getEvent,
	createExelOfRegistrations,
};
