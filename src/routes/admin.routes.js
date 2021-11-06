const { updateUser } = require("../controllers/admin.controller");
const protect = require("../middleware/auth");

const router = require("express").Router();

router.put("/updateuser/:userId", protect, updateUser);

module.exports = router;
