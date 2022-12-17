const express = require("express");
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");
const { protect, authorized } = require("../middleware/auth");
// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");
const router = express.Router();
// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorized("admin", "publisher"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorized("admin", "publisher"), updateBootcamp)
  .delete(protect, authorized("admin", "publisher"), deleteBootcamp);
router
  .route("/:id/photo")
  .put(protect, authorized("admin", "publisher"), bootcampPhotoUpload);
module.exports = router;
