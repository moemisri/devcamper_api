const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");
const { protect, authorized } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });
router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);
router.post("/", protect, authorized("user", "admin"), addReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorized("user", "admin"), updateReview)
  .delete(protect, authorized("user", "admin"), deleteReview);
module.exports = router;
