const router = require("express").Router();
const userRoutes = require("../routes/user.routes");
const societyRoutes = require("../routes/society.routes");
const superAdminRoutes = require("../routes/superadmin.routes");
const eventsRoutes = require("../routes/events.routes");
const registrationRoutes = require("../routes/registration.routes");

const allAPIS = () => {
	router.use("/user", userRoutes);
	router.use("/society", societyRoutes);
	router.use("/super", superAdminRoutes);
	router.use("/event", eventsRoutes);
	router.use("/registration", registrationRoutes);
	return router;
};

module.exports = allAPIS;
