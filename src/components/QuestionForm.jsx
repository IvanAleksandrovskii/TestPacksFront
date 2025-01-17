import React from 'react';
import AnswerForm from './AnswerForm';


const QuestionForm = ({ 
  question, 
  index, 
  updateQuestion, 
  removeQuestion, 
  addAnswer, 
  removeAnswer, 
  updateAnswer 
}) => {
  return (
    <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid black" }}>
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
            <AnswerForm
              key={answerIndex}
              answer={answer}
              questionIndex={index}
              answerIndex={answerIndex}
              updateAnswer={updateAnswer}
              removeAnswer={removeAnswer}
            />
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
  );
};


export default QuestionForm;