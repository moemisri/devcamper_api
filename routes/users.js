const express = require("express");
const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorized } = require("../middleware/auth");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
router.use(protect);
router.use(authorized("admin"));
router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
