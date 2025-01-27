// src/AppDebug.jsx

// TODO: Debug version

// import React, { useEffect, useState } from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
//   useNavigate,
// } from 'react-router-dom';
// import CreateQuiz from './pages/CreateQuiz';
// import EditQuiz from './pages/EditQuiz';
// import TestList from './pages/TestList';
// import TestPackList from './pages/TestPackList';
// import Layout from './components/Layout';
// import CreateTestPack from './pages/CreateTestPack';
// import EditTestPack from './pages/EditTestPack';


// function App() {
//   const [tgUser, setTgUser] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     try {
//       const urlParams = new URLSearchParams(window.location.search);
//       const isDebugMode = urlParams.get('debug') === 'true';

//       if (!isDebugMode) {
//         const tg = window?.Telegram?.WebApp;
//         if (tg) {
//           tg.ready();
//           if (tg.initDataUnsafe?.user) {
//             setTgUser(tg.initDataUnsafe.user);
//           } else {
//             setTgUser({ id: 111 }); // mock user
//           }
//           setIsDarkMode(tg.colorScheme === 'dark');
//           tg.onEvent('themeChanged', () => {
//             setIsDarkMode(tg.colorScheme === 'dark');
//           });
//           tg.BackButton.onClick(() => {
//             navigate(-1);
//           });
//         } else {
//           console.warn('Telegram Web App not detected. Using mock data.');
//           setTgUser({ id: 111 });
//         }
//       } else {
//         console.warn('Debug mode enabled.');
//         setTgUser({ id: 111 }); // mock user for debugging
//         setIsDarkMode(false); // Default to light mode for debugging
//       }

//       setIsInitialized(true);
//     } catch (error) {
//       console.error('Error initializing Telegram WebApp:', error);
//       setTgUser({ id: 111 });
//       setIsInitialized(true);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const tg = window?.Telegram?.WebApp;
//     if (!tg) return;

//     if (location.pathname === '/' || location.pathname === '/test_packs') {
//       tg.BackButton.hide();
//     } else {
//       tg.BackButton.show();
//     }
//   }, [location.pathname]);

//   if (!isInitialized) {
//     return <div>Initializing Telegram WebApp...</div>;
//   }

//   const textColor = isDarkMode ? 'white' : 'black';

//   return (
//     <div style={{ padding: '20px', color: textColor }}>
//       <Routes>
//         <Route
//           path="/"
//           element={<Layout isDarkMode={isDarkMode} tgUser={tgUser} />}
//         >
//           <Route path="/" element={<TestList tgUser={tgUser} />} />
//           <Route
//             path="/test_packs"
//             element={<TestPackList creatorId={tgUser?.id} />}
//           />
//         </Route>
//         <Route path="/create" element={<CreateQuiz tgUser={tgUser} />} />
//         <Route path="/edit/:id" element={<EditQuiz creatorId={tgUser?.id} />} />
//         <Route
//           path="/packs"
//           element={<TestPackList creatorId={tgUser?.id} />}
//         />
//         <Route
//           path="/packs/create"
//           element={
//             <CreateTestPack
//               creatorId={tgUser?.id}
//               creatorUsername={tgUser?.username}
//             />
//           }
//         />
//         <Route
//           path="/packs/edit/:packId"
//           element={<EditTestPack />}
//         />
//       </Routes>
//     </div>
//   );
// }

// export default function RootApp() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }