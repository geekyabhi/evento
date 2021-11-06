const router = require("express").Router();
const userRoutes = require("../routes/user.routes");
const societyRoutes = require("../routes/society.routes");
const superAdminRoutes = require("../routes/superadmin.routes");
const eventsRoutes = require("../routes/events.routes");

const allAPIS = () => {
	router.use("/user", userRoutes);
	router.use("/society", societyRoutes);
	router.use("/super", superAdminRoutes);
	router.use("/event", eventsRoutes);
	return router;
};

module.exports = allAPIS;
