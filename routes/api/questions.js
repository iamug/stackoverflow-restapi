const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Question = require("../../models/Questions");

// @route  POST api/questions
// @desc   Create questions route
// @access Private
router.post("/", auth, async (req, res) => {
  let { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let insertData = { title, description };
  insertData.author = req.user.id;
  try {
    let question = await new Question(insertData).save();
    res.status(201).send({ success: true, question });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/questions/user
// @desc    Get all questions for authenticated user route
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const questions = await Question.find({ author: req.user.id })
      .sort({
        createdAt: -1,
      })
      .lean();
    if (!questions) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/questions
// @desc    Get all questions route
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({
        createdAt: -1,
      })
      .lean();
    if (!questions) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/questions/:id
// @desc    Get question details route
// @access  Private
// @Params  id -- id of question
router.get("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    const question = await Question.findById(req.params.id)
      .populate("answers")
      .lean();
    if (!question)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    res.json({ success: true, question });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/questions/:id
// @desc   Delete questions route
// @access Private
// @Params  id -- id of question
router.delete("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    if (question.author !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: "You don't have permission to this question",
      });
    }
    await Question.findByIdAndRemove(req.params.id);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
