const {
	register,
	login,
	logout,
	logoutAll,
	find,
	update,
	remove,
	getAllEvents,
} = require("../controllers/user.controller");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.post("/", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/logout/all", protect, logoutAll);
router.get("/", protect, find);
router.get("/events", getAllEvents);
router.put("/", protect, update);
router.delete("/", protect, remove);

module.exports = router;
