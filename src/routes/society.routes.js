const { addSociety } = require("../controllers/society.controller");
const superProtect = require("../middleware/superAuth");

const router = require("express").Router();

router.post("/", superProtect, addSociety);

module.exports = router;
