import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [allowBack, setAllowBack] = useState(true);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        is_quiz_type: false,
        answers: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;

    if (field === "is_quiz_type") {
      if (value) {
        // Add a default answer if it is a quiz type and no answers exist
        if (updatedQuestions[index].answers.length === 0) {
          updatedQuestions[index].answers.push({ text: "", score: 0 });
        }
      } else {
        // Remove all answers if it is not a quiz type
        updatedQuestions[index].answers = [];
      }
    }

    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].answers.length < 6) {
      updatedQuestions[questionIndex].answers.push({ text: "", score: 0 });
      setQuestions(updatedQuestions);
    }
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter((_, aIndex) => aIndex !== answerIndex);
    setQuestions(updatedQuestions);
  };

  const updateAnswer = (questionIndex, answerIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const submitTest = async () => {
    const testPayload = {
      name: testName,
      description,
      creator_id: parseInt(creatorId),
      allow_back: allowBack,
      questions,
    };

    try {
      const response = await axios.post("https://15d8-49-228-96-123.ngrok-free.app/api/custom_tests/", testPayload); // TODO: FIX
      alert(`Test created with ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error creating test:", error);
      alert("Failed to create test. Check the console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Custom Test</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>Test Name:</label>
        <br />
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Description:</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* TODO: Move to tg getting from tg window */}
      <div style={{ marginBottom: "10px" }}>
        <label>Creator ID: (Будет получено из telegram)</label>
        <br />
        <input
          type="number"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Allow Back:</label>
        <br />
        <input
          type="checkbox"
          checked={allowBack}
          onChange={(e) => setAllowBack(e.target.checked)}
        />
      </div>

      <h2>Questions</h2>
      {questions.map((question, index) => (
        <div
          key={index}
          style={{ marginBottom: "20px", padding: "10px", border: "1px solid black" }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>Question Text:</label>
            <br />
            <input
              type="text"
              value={question.question_text}
              onChange={(e) => updateQuestion(index, "question_text", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Is Quiz Type:</label>
            <br />
            <input
              type="checkbox"
              checked={question.is_quiz_type}
              onChange={(e) => updateQuestion(index, "is_quiz_type", e.target.checked)}
            />
          </div>

          {question.is_quiz_type && (
            <div>
              <h3>Answers</h3>
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} style={{ marginBottom: "10px" }}>
                  <label>Answer Text:</label>
                  <br />
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      updateAnswer(index, answerIndex, "text", e.target.value)
                    }
                  />

                  <br />

                  <label>Answer Score:</label>
                  <br />
                  <input
                    type="number"
                    value={answer.score}
                    onChange={(e) =>
                      updateAnswer(index, answerIndex, "score", e.target.value)
                    }
                  />

                  <br />
                  
                  <button
                    onClick={() => removeAnswer(index, answerIndex)}
                    style={{ marginTop: "10px" }}
                  >
                    Remove Answer
                  </button>
                </div>
              ))}

              {question.answers.length < 6 && (
                <button onClick={() => addAnswer(index)}>Add Answer</button>
              )}
            </div>
          )}

          <button
            onClick={() => removeQuestion(index)}
            style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
          >
            Remove Question
          </button>
        </div>
      ))}

      <button onClick={addQuestion}>Add Question</button>

      <button onClick={submitTest} style={{ marginTop: "20px" }}>Submit Test</button>
    </div>
  );
};

export default App;
