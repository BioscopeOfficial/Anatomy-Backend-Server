app.post("/save-basic-quiz", async (req, res) => {
  const { email, score } = req.body;

  try {
    let quizEntries = await Quiz.find({ email });

    if (quizEntries.length < 3) {
      // Less than 3 entries: Add a new one
      const newQuizEntry = new Quiz({
        email,
        BasicQuiz: true,
        BasicQuizMarks: score,
      });
      await newQuizEntry.save();
      return res.status(200).json({ message: "New quiz entry added successfully!" });
    } else if (quizEntries.length === 3) {
      // Exactly 3 entries: Find the one with the lowest score and update it
      let lowestEntry = quizEntries.reduce((min, entry) =>
        entry.BasicQuizMarks < min.BasicQuizMarks ? entry : min
      );

      if (lowestEntry.BasicQuizMarks < score) {
        lowestEntry.BasicQuizMarks = score;
        await lowestEntry.save();
        return res.status(200).json({ message: "Lowest score updated successfully!" });
      } else {
        return res.status(400).json({ message: "Score is not higher than the lowest existing score. No update performed." });
      }
    } else {
      // More than 3 entries: Do not allow updates
      return res.status(400).json({ message: "Maximum quiz entries reached. No update allowed." });
    }
  } catch (error) {
    console.error("Error saving quiz data:", error);
    res.status(500).json({ message: "Error saving quiz data" });
  }
});
