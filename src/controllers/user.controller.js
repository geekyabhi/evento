const User = require("../models/User.model");
const router = require("../routes/user.routes");
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
			const currentToken = generateToken(user._id);
			const updatedTokens = [...user.tokens, currentToken];
			user.tokens = updatedTokens;
			await user.save();
			res.status(200).json({
				success: true,
				data: {
					_id: user._id,
					name: user.name,
					collegeId: user.collegeId,
					isAdmin: user.isAdmin,
					adminOf: user.adminOf,
					year: user.year,
					token: currentToken,
					tokens: user.tokens,
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

const logout = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		const currentToken = req.token;
		const tokens = user.tokens;
		const newTokens = tokens.filter((token) => {
			return token !== currentToken;
		});
		user.tokens = newTokens;
		await user.save();
		return res.status(200).send({
			success: true,
			message: "Successfully logged out",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

const logoutAll = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		user.tokens = [];
		await user.save();
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

const find = async (req, res) => {
	try {
		const user = req.user;
		return res.status(200).send({
			success: true,
			data: user,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

const update = async (req, res) => {
	try {
		const { name, collegeId, password, year } = req.body;
		const user = req.user;
		user.name = name || user.name;
		user.collegeId = collegeId || user.collegeId;
		user.year = year || user.year;

		if (password) {
			user.password = password;
		}
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

const remove = async (req, res) => {
	try {
		const user = req.user;
		const savedUser = user;
		await user.remove();
		res.status(200).send({
			success: true,
			data: {
				_id: savedUser._id,
				name: savedUser.name,
				collegeId: savedUser.collegeId,
				isAdmin: savedUser.isAdmin,
				adminOf: savedUser.adminOf,
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

module.exports = { register, login, logout, logoutAll, find, update, remove };
