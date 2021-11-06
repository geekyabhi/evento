const {
	addRegistration,
	deleteRegistration,
} = require("../controllers/registration.controller");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.post("/:eventId", protect, addRegistration);
router.delete("/:eventId/:registrationId", protect, deleteRegistration);

module.exports = router;
