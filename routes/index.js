const Router = require("express");
const router = new Router();
const UsersController = require("../controllers/UsersController");
const StatsController = require("../controllers/StatsController");

router.get("/users", UsersController.getUsers);
router.get("/stats/:user_id", StatsController.getInfo);

module.exports = router;
