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


const App = () => {
  const [tgInitData, setTgInitData] = useState(null);
  const [tgUser, setTgUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Хуки React Router, чтобы делать переходы (navigate) и отслеживать текущий url (location)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const tg = window?.Telegram?.WebApp;

      if (tg) {
        // Сигнализируем Telegram, что WebApp готов к работе
        tg.ready();

        // Сохраняем данные инициализации
        setTgInitData(tg.initDataUnsafe);

        // Устанавливаем пользователя
        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
        } else {
          // Если пользователь не передан, используем mock
          setTgUser({ id: 111 });
        }

        // Подписываемся на нажатие нативной кнопки «Назад» Telegram
        tg.BackButton.onClick(() => {
          navigate(-1); // Возвращаемся на предыдущую страницу в истории
        });
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
  }, [navigate]);

  // Следим за изменениями маршрута, чтобы скрывать/показывать BackButton
  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return;

    if (location.pathname === '/') {
      // На главной странице кнопку «Назад» прячем
      tg.BackButton.hide();
    } else {
      // На любом другом маршруте показываем
      tg.BackButton.show();
    }
  }, [location.pathname]);

  if (!isInitialized) {
    return <div>Initializing Telegram WebApp...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: 'black' }}>
      <Routes>
        <Route path="/" element={<TestList tgUser={tgUser} />} />
        <Route path="/create" element={<CreateQuiz tgUser={tgUser} />} />
        <Route path="/edit/:id" element={<EditQuiz creatorId={tgUser?.id} />} />
      </Routes>

      {/* Если пользователь реальный (не mock), выводим debug-информацию */}
      {tgUser && tgUser.id !== 111 && (
        <div
          style={{
            padding: '20px',
            color: 'white',
            backgroundColor: 'gray',
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
};


// Оборачиваем App в Router здесь, чтобы внутри App работал useNavigate/useLocation
export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}