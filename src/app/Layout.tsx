import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { AppHeader } from "./AppHeader";

import "./Layout.css";

interface LayoutProps {
    isAuth: boolean
}

export const Layout: React.FC<LayoutProps> = ({isAuth}) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (pathname === "/") {
            navigate("/chats");
        }
    }, [pathname, navigate]);

    return (
        <div className="appLayout container">
            <header className="appHeader">
                <AppHeader isAuth={isAuth} />
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}