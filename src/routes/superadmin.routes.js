const router = require("express").Router();
const {
	register,
	login,
	logout,
	logoutAll,
} = require("../controllers/superadmin.controller");
const superProtect = require("../middleware/superAuth");

router.post("/", register);
router.post("/login", login);
router.post("/logout", superProtect, logout);
router.post("/logout/all", superProtect, logoutAll);
module.exports = router;
