import React from 'react';

const AnswerForm = ({ 
  answer, 
  questionIndex, 
  answerIndex, 
  updateAnswer, 
  removeAnswer 
}) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>Answer Text:</label>
      <br />
      <input
        type="text"
        value={answer.text}
        onChange={(e) => updateAnswer(questionIndex, answerIndex, "text", e.target.value)}
      />

      <br />

      <label>Answer Score:</label>
      <br />
      <input
        type="number"
        value={answer.score}
        onChange={(e) => updateAnswer(questionIndex, answerIndex, "score", e.target.value)}
      />

      <br />
      
      <button
        onClick={() => removeAnswer(questionIndex, answerIndex)}
        style={{ marginTop: "10px" }}
      >
        Remove Answer
      </button>
    </div>
  );
};


export default AnswerForm;