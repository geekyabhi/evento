const Society = require("../models/Society.model");

const addSociety = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res.status(400).send({
				success: false,
				error: "Please provide name",
			});
		}
		const preSociety = await Society.findOne({ name });
		if (preSociety) {
			return res.status(400).send({
				success: false,
				error: "Society with same name already exists",
			});
		}
		const society = new Society({ name, description });
		await society.save();
		res.status(200).send({
			success: true,
			data: society,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

module.exports = { addSociety };
