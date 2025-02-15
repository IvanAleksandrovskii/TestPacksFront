// src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

import NavigationPanel from './NavigationPanel';


const Layout = ({ isDarkMode, tgUser }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 pb-16 overflow-auto">
                <Outlet />
            </main>
            <NavigationPanel isDarkMode={isDarkMode} />
        </div>
    );
};

export default Layout;
