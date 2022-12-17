const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { protect, authorized } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorized("admin", "publisher"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorized("admin", "publisher"), updateCourse)
  .delete(protect, authorized("admin", "publisher"), deleteCourse);
module.exports = router;
