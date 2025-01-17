import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import TestList from './pages/TestList';


const App = () => {
  const [tgInitData, setTgInitData] = useState(null);
  const [tgUser, setTgUser] = useState({ id: 111 }); // Моковые данные по умолчанию, для тестов, если открыто в браузере

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();
      setTgInitData(tg.initDataUnsafe);

      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    } else {
      console.warn("Telegram Web App not detected. Using mock data.");
    }
  }, []);

  return (
    <Router>
      <div style={{ padding: '20px', color: 'white', backgroundColor: 'black' }}>
        <Routes>
        <Route path="/" element={<TestList tgUser={tgUser} />} />

          <Route path="/create" element={<CreateQuiz tgUser={tgUser} />} />

          <Route path="/edit/:id" element={<EditQuiz creatorId={tgUser.id} />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
