const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Question = require("../../models/Questions");

// @route  POST api/answers/id
// @desc   Create answers route
// @access Private
// @Params  id -- id of question
router.post("/:id", auth, async (req, res) => {
  let { body } = req.body;
  if (!req.params.id || !body) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  try {
    let question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    question.addAnswer(req.user.id, body);
    res.status(201).send({ success: true });
  } catch (err) {
    console.log(err);
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
