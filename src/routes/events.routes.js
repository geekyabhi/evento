const {
	addEvents,
	updateEvents,
	deleteEvents,
	getEvents,
	getEvent,
} = require("../controllers/events.controller");
const societyProtect = require("../middleware/societyAuth");

const router = require("express").Router();

router.get("/", societyProtect, getEvents);
router.get("/:id", societyProtect, getEvent);
router.post("/", societyProtect, addEvents);
router.put("/:id", societyProtect, updateEvents);
router.delete("/:id", societyProtect, deleteEvents);

module.exports = router;
