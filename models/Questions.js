const mongoose = require("mongoose");
const answerSchema = require("./Answers").schema;

const QuestionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

// Add answer to a question
QuestionSchema.methods.addAnswer = function (author, body) {
  this.answers.push({ author, body });
  return this.save();
};

module.exports = Question = mongoose.model("questions", QuestionSchema);
