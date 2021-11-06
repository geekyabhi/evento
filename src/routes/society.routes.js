const {
	addSociety,
	loginSociety,
	logoutSociety,
	logoutSocietyAll,
	updateSociety,
	deleteSociety,
} = require("../controllers/society.controller");
const societyProtect = require("../middleware/societyAuth");
const superProtect = require("../middleware/superAuth");

const router = require("express").Router();

router.post("/", superProtect, addSociety);
router.post("/login", loginSociety);
router.post("/logout", societyProtect, logoutSociety);
router.post("/logout/all", societyProtect, logoutSocietyAll);
router.put("/", societyProtect, updateSociety);
router.delete("/:id", superProtect, deleteSociety);

module.exports = router;
