import React, { useState } from 'react';
import QuestionForm from '../components/QuestionForm';
import { quizApi } from '../api/quizApi';

const CreateQuiz = () => {
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
        if (updatedQuestions[index].answers.length === 0) {
          updatedQuestions[index].answers.push({ text: "", score: 0 });
        }
      } else {
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
    updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter(
      (_, aIndex) => aIndex !== answerIndex
    );
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
      const response = await quizApi.createTest(testPayload);
      alert(`Test created with ID: ${response.id}`);
    } catch (error) {
      console.error("Error creating test:", error);
      alert("Failed to create test. Check the console for details.");
    }
  };

  return (
    <div>
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
        <QuestionForm
          key={index}
          question={question}
          index={index}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
          addAnswer={addAnswer}
          removeAnswer={removeAnswer}
          updateAnswer={updateAnswer}
        />
      ))}

      <button onClick={addQuestion}>Add Question</button>
      <button onClick={submitTest} style={{ marginTop: "20px" }}>Submit Test</button>
    </div>
  );
};


export default CreateQuiz;
