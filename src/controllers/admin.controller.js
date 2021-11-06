const User = require("../models/User.model");

const updateUser = async (req, res) => {
	try {
		const adminUser = req.user;
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).send({
				success: false,
				error: "Provide user",
			});
		}

		if (!adminUser.isAdmin) {
			return res.status(401).send({
				success: false,
				error: `Not authorized as admin`,
			});
		}

		const user = await User.findById(userId).populate("society");
		if (!user) {
			return res.status(404).send({
				success: false,
				error: `No such user found`,
			});
		}
		const { isAdmin } = req.body;
		user.isAdmin = isAdmin;
		if (isAdmin) {
			user.society = adminUser.society;
		}
		if (!isAdmin) {
			user.society = "61829ff4dbdb48788a122c9b";
		}
		const savedUser = await user.save();
		res.status(200).send({
			success: true,
			data: {
				_id: savedUser._id,
				name: savedUser.name,
				collegeId: savedUser.collegeId,
				isAdmin: savedUser.isAdmin,
				society: savedUser.society,
				year: savedUser.year,
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

module.exports = { updateUser };
