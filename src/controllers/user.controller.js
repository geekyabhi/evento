const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
	try {
		const { name, collegeId, password, year } = req.body;
		if (!name) {
			return res.status(400).send({
				success: false,
				error: "Please enter your name",
			});
		}
		if (!collegeId) {
			return res.status(400).send({
				success: false,
				error: "Please enter your college Id",
			});
		}
		if (!password) {
			return res.status(400).send({
				success: false,
				error: "Please enter your password",
			});
		}
		const preUser = await User.findOne({ collegeId: collegeId });
		if (preUser) {
			return res.status(400).send({
				success: false,
				error: "User with same college id already exist",
			});
		}
		const user = new User({ name, collegeId, password, year });
		const savedUser = await user.save();
		res.status(200).send({
			success: true,
			data: {
				_id: savedUser._id,
				name: savedUser.name,
				collegeId: savedUser.collegeId,
				isAdmin: savedUser.isAdmin,
				adminOf: savedUser.adminOf,
				year: savedUser.year,
				token: generateToken(savedUser._id),
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

const login = async (req, res) => {
	try {
		const { collegeId, password } = req.body;
		if (!collegeId) {
			return res.status(400).send({
				success: false,
				error: "Please enter your college Id",
			});
		}
		if (!password) {
			return res.status(400).send({
				success: false,
				error: "Please enter your password",
			});
		}
		const user = await User.findOne({ collegeId: collegeId });
		if (user && (await user.matchPassword(password))) {
			res.status(200).json({
				success: true,
				data: {
					_id: user._id,
					name: user.name,
					collegeId: user.collegeId,
					isAdmin: user.isAdmin,
					adminOf: user.adminOf,
					year: user.year,
					token: generateToken(user._id),
				},
			});
		} else {
			return res.status(401).json({
				success: false,
				error: "Wrong email or password",
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

module.exports = { register, login };
