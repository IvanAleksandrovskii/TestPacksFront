import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateQuiz from './pages/CreateQuiz';

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px", color: "white", backgroundColor: "black" }}>
        <Routes>
          <Route path="/" element={<CreateQuiz />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
