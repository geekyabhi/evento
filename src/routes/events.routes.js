const {
	addEvents,
	updateEvents,
	deleteEvents,
} = require("../controllers/events.controller");
const societyProtect = require("../middleware/societyAuth");

const router = require("express").Router();

router.post("/", societyProtect, addEvents);
router.put("/:id", societyProtect, updateEvents);
router.delete("/:id", societyProtect, deleteEvents);

module.exports = router;
