const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
// @desc   Get a single course
// @route  GET /api/v1/couses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name",
  });
  if (!course) {
    return next(
      new ErrorResponse(`No Course with ID of: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc   Add a new course
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  console.log("req.user.role:", req.user.role);
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with ID of: ${req.params.bootcampId}`, 404)
    );
  }
  console.log("req.user.role:", req.user.role);
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to add courses to this bootcamp ${bootcamp.id}`
      )
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc   Update courses
// @route  PUT /api/v1/couses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  console.log("req.user.role:", req.user.role);
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No Course with ID of: ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to update this course ${course._id}`
      )
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc   Delete courses
// @route  DELETE /api/v1/couses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No Course with ID of: ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to delete this course ${course._id}`
      )
    );
  }
  await course.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
