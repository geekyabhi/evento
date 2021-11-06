const router = require("express").Router();
const userRoutes = require("../routes/user.routes");
const societyRoutes = require("../routes/society.routes");
const superAdminRoutes = require("../routes/superadmin.routes");

const allAPIS = () => {
	router.use("/user", userRoutes);
	router.use("/society", societyRoutes);
	router.use("/super", superAdminRoutes);
	return router;
};

module.exports = allAPIS;
