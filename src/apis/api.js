const router = require("express").Router();
const userRoutes = require("../routes/user.routes");

const allAPIS = () => {
	router.use("/user", userRoutes);
	return router;
};

module.exports = allAPIS;
