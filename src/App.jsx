import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import TestList from './pages/TestList';


const App = () => {
  const [tgInitData, setTgInitData] = useState(null);
  const [tgUser, setTgUser] = useState(null); 
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const tg = window?.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        setTgInitData(tg.initDataUnsafe);
        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
        } else {
          setTgUser({ id: 111 }); // Устанавливаем моковые данные только если не получили реального пользователя
        }
      } else {
        console.warn("Telegram Web App not detected. Using mock data.");
        setTgUser({ id: 111 });
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing Telegram WebApp:", error);
      setTgUser({ id: 111 });
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return (
    <div>
      Initializing Telegram WebApp...
    </div>
  );
  }

  return (
    <Router>
      <div style={{ padding: '20px', color: 'white', backgroundColor: 'black' }}>
        <Routes>
          <Route path="/" element={<TestList tgUser={tgUser} />} />
          <Route path="/create" element={<CreateQuiz tgUser={tgUser} />} />
          <Route path="/edit/:id" element={<EditQuiz creatorId={tgUser?.id} />} />
        </Routes>
      </div>
      <div style={{ padding: '20px', color: 'white', backgroundColor: 'gray' }}>
        {tgUser && <p>tgUser: {JSON.stringify(tgUser)}</p>}
      </div>
    </Router>
  );
};


export default App;
