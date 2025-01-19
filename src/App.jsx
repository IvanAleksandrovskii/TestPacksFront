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

function App() {
  const [tgInitData, setTgInitData] = useState(null);
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
        setTgInitData(tg.initDataUnsafe);

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
        tg.BackButton.onClick(() => {
          navigate(-1);
        });
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

    if (location.pathname === '/') {
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
    <div style={{ padding: '20px', color: textColor }}>
      <Routes>
        <Route path="/" element={<TestList tgUser={tgUser} />} />
        <Route path="/create" element={<CreateQuiz tgUser={tgUser} />} />
        <Route path="/edit/:id" element={<EditQuiz creatorId={tgUser?.id} />} />
      </Routes>

      {/* Если пользователь "реальный" (не mock), выводим debug-информацию */}
      {tgUser && tgUser.id !== 111 && (
        <div
          style={{
            padding: '20px',
            color: textColor,
            backgroundColor: isDarkMode ? '#666666' : '#eeeeee',
            textAlign: 'center',
            margin: '0 auto',
            wordWrap: 'break-word'
          }}
        >
          <p>tgUser: {JSON.stringify(tgUser)}</p>
        </div>
      )}
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