// src/components/Layout.jsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationPanel from './NavigationPanel';

const Layout = ({ isDarkMode, tgUser }) => {
    const location = useLocation();

    // Можно завести список путей, где нужно скрыть панель
    const hideNavOnRoutes = ['/create', '/edit'];

    // Если в hideNavOnRoutes найдётся такой путь, что совпадает с началом location.pathname,
    // значит на этом роуте панель навигации скрывается
    const hideNavigation = hideNavOnRoutes.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <div style={{ padding: '20px' }}>
            {/* Основной контент рендерится через <Outlet /> */}
            <Outlet />

            {/* Показываем NavigationPanel только если не попали в список исключений */}
            {!hideNavigation && <NavigationPanel isDarkMode={isDarkMode} />}
        </div>
    );
};

export default Layout;
