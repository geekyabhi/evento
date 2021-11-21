const Society = require("../models/Society.model");
const generateToken = require("../utils/generateToken");

const addSociety = async (req, res) => {
	try {
		const { name, image, handle, password } = req.body;
		if (!name) {
			return res.status(400).send({
				success: false,
				error: "Please provide name",
			});
		}
		if (!handle) {
			return res.status(400).send({
				success: false,
				error: "Please provide society handle",
			});
		}
		if (!password) {
			return res.status(400).send({
				success: false,
				error: "Please provide password",
			});
		}
		const preSociety =
			(await Society.findOne({ name })) ||
			(await Society.findOne({ handle }));
		if (preSociety) {
			return res.status(400).send({
				success: false,
				error: "Society with same name or handle already exists",
			});
		}
		const society = new Society({ name, image, handle, password });
		await society.save();
		res.status(200).send({
			success: true,
			data: {
				_id: society._id,
				name: society.name,
				image: society.image,
				handle: society.handle,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const loginSociety = async (req, res) => {
	try {
		const { handle, password } = req.body;
		const society = await Society.findOne({ handle });

		console.log(society);
		if (society && (await society.matchPassword(password))) {
			const currentToken = generateToken(society._id);
			const updatedTokens = [...society.tokens, currentToken];
			society.tokens = updatedTokens;
			await society.save();
			res.status(200).json({
				success: true,
				data: {
					_id: society._id,
					name: society.name,
					handle: society.handle,
					token: currentToken,
				},
			});
		} else {
			return res.status(400).send({
				success: false,
				error: "Wrong handle or password",
			});
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const logoutSociety = async (req, res) => {
	try {
		const society = req.society;
		if (!society) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		const currentToken = req.token;
		const tokens = society.tokens;
		const newTokens = tokens.filter((token) => {
			return token !== currentToken;
		});
		society.tokens = newTokens;
		await society.save();
		return res.status(200).send({
			success: true,
			message: "Successfully logged out",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const logoutSocietyAll = async (req, res) => {
	try {
		const society = req.society;
		if (!society) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		society.tokens = [];
		await society.save();
		return res.status(200).send({
			success: true,
			message: "Successfully logged out from all devices",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

const updateSociety = async (req, res) => {
	try {
		const society = req.society;
		const { name, image, handle, password } = req.body;
		const preSociety =
			(await Society.findOne({ name })) ||
			(await Society.findOne({ handle }));
		if (preSociety) {
			return res.status(400).send({
				success: false,
				error: "Society with same name or handle already exists",
			});
		}
		society.name = name || society.name;
		society.image = image || society.image;
		society.handle = handle || society.handle;
		if (password) {
			society.password = password;
		}
		await society.save();
		res.status(200).send({
			success: true,
			data: {
				_id: society._id,
				name: society.name,
				image: society.image,
				handle: society.handle,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

const deleteSociety = async (req, res) => {
	try {
		const { id } = req.params;
		const society = await Society.findById(id);
		if (!society) {
			return res.status(404).send({
				success: false,
				error: "No such society found",
			});
		}
		const deletedSociety = society;
		await society.remove();
		res.status(200).send({
			success: true,
			data: "Socity removed !",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

module.exports = {
	addSociety,
	loginSociety,
	logoutSociety,
	logoutSocietyAll,
	updateSociety,
	deleteSociety,
};
