import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';

import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import TestList from './pages/TestList';

import TestPackList from './pages/TestPackList';
import Layout from './components/Layout';
import CreateTestPack from './pages/CreateTestPack';
import EditTestPack from './pages/EditTestPack';

import Home from './pages/Home';

import TestPackCompletionsPage from './pages/TestPackCompletionsPage';
import TestPackCompletionDetails from './components/TestPackCompletionDetails';



function App() {
  const [tgUser, setTgUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Сохраняем флаг "Тёмная тема" / "Светлая тема"
  // По умолчанию считаем тему светлой => текст чёрный
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const tg = window?.Telegram?.WebApp;

      if (tg) {
        tg.ready();

        // Определяем пользователя
        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
        } else {
          setTgUser({ id: 111 }); // mock-пользователь
        }

        // Определяем, какая тема сейчас в Telegram
        // colorScheme может быть 'dark' или 'light'
        setIsDarkMode(tg.colorScheme === 'dark');

        // Подписываемся на событие смены темы
        tg.onEvent('themeChanged', () => {
          setIsDarkMode(tg.colorScheme === 'dark');
        });

        // Кнопка «Назад» в шапке
        // tg.BackButton.onClick(() => {
        //   navigate(-1);
        // });
      } else {
        // Если окно открыто вне Telegram
        console.warn("Telegram Web App not detected. Using mock data and default theme.");
        setTgUser({ id: 111 });
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing Telegram WebApp:", error);
      setTgUser({ id: 111 });
      setIsInitialized(true);
    }
  }, [navigate]);

  // Показываем/скрываем BackButton в зависимости от маршрута
  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return;

    if (location.pathname === '/' || location.pathname === '/test_packs' || location.pathname === '/tests' || location.pathname === '/test-completions') {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
    }
  }, [location.pathname]);

  if (!isInitialized) {
    return <div>Initializing Telegram WebApp...</div>;
  }

  // Если тема тёмная => текст белый, иначе чёрный.
  const textColor = isDarkMode ? 'white' : 'black';

  return (
    <div className="app-container" style={{ color: textColor }}>
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={<Layout isDarkMode={isDarkMode} tgUser={tgUser} />}
          >
            <Route path="/" element={<Home />} />
            <Route path="/tests" element={<TestList tgUser={tgUser} />} />
            <Route path="/test_packs" element={<TestPackList creatorId={tgUser?.id} />} />

            <Route path="/test-completions" element={<TestPackCompletionsPage tgUser={tgUser} isDarkMode={isDarkMode} />} />
          </Route>
          <Route path="/test-completions/:id" element={<TestPackCompletionDetails />} />

          <Route path="/create" element={<CreateQuiz tgUser={tgUser} />} />
          <Route path="/edit/:id" element={<EditQuiz creatorId={tgUser?.id} />} />
          <Route
            path="/packs/create"
            element={
              <CreateTestPack
                creatorId={tgUser?.id}
                creatorUsername={tgUser?.username}
              />
            }
          />
          <Route
            path="/packs/edit/:packId"
            element={<EditTestPack />}
            className="footer"
          />
        </Routes>
      </div>
    </div>
  );
}


export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
