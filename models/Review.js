const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxLength: 100,
    required: [true, "Please add a Review title"],
  },
  text: {
    type: String,
    required: [true, "Please add a text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add rating between 1 and 10"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});
// Call getAverageCost before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
