// src/components/NavigationPanel.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Package, Home, CheckCircle } from 'lucide-react';

import '../style/navigationPanel.css';

// import click1 from '../assets/sounds/click-1.mp3';
import clickSoft from '../assets/sounds/click-soft.wav';


const NavigationPanel = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const audioRef = useRef(null);

  useEffect(() => {
    // Предзагрузка звука при монтировании компонента
    audioRef.current = new Audio(clickSoft);
    // Предварительная загрузка аудио
    audioRef.current.load();

    return () => {
      // Очистка при размонтировании
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      // Сброс воспроизведения в начало для мгновенного проигрывания
      audioRef.current.currentTime = 0;
      // Воспроизведение с небольшой задержкой для избежания проблем с перекрытием
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Игнорируем ошибки воспроизведения
        });
      }
    }
  };

  const handleNavigation = (path) => {
    // Сначала воспроизводим звук для мгновенной реакции
    // playSound();  // TODO: ЗВУК ОТКЛЮЧЕН, ПРОТИВНО (( ! ))

    // Проверяем доступность Telegram WebApp
    const tg = window?.Telegram?.WebApp;
    if (tg) {
      tg.HapticFeedback.impactOccurred('light');
    }

    // Навигация
    navigate(path);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-18 ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'
      } border-t safe-bottom`}>
      <div className="flex justify-around w-full max-w-md mx-auto h-full">
        <button
          onClick={() => handleNavigation('/tests')}
          className={`flex flex-col items-center justify-center w-20 h-full ${location.pathname === '/tests' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } hover:text-blue-400 transition-colors`}
        >
          <ClipboardList size={24} style={{ minBlockSize: '18px', marginTop: "8px" }} />
          <span className="text-xs mt-1">Тесты</span>
        </button>
        <button
          onClick={() => handleNavigation('/')}
          className={`flex flex-col items-center justify-center w-20 h-full ${location.pathname === '/' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } hover:text-blue-400 transition-colors`}
        >
          <Home size={24} style={{ minBlockSize: '18px', marginTop: "8px" }} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => handleNavigation('/test_packs')}
          className={`flex flex-col items-center justify-center w-20 h-full ${location.pathname === '/test_packs' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } hover:text-blue-400 transition-colors`}
        >
          <Package size={24} style={{ minBlockSize: '18px', marginTop: "8px" }} />
          <span className="text-xs mt-1">Наборы</span>
        </button>
        <button
          onClick={() => handleNavigation('/test-completions')}
          className={`flex flex-col items-center justify-center w-20 h-full ${location.pathname === '/test-completions' ? 'text-blue-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } hover:text-blue-400 transition-colors`}
        >
          <CheckCircle size={24} style={{ minBlockSize: '18px', marginTop: "8px" }} />
          <span className="text-xs mt-1">Прохождения</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;
