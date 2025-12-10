import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TodoContent from './components/TodoContent';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [showLogin, setShowLogin] = useState(true); 

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const setAuth = (status) => {
        setIsAuthenticated(status);
        if (status === true) {
             setShowLogin(true); 
        }
    };

    const toggleAuthForm = () => {
        setShowLogin(!showLogin);
    };

    if (isAuthenticated === null) {
        return <h1>Carregando...</h1>;
    }

    const renderContent = () => {
        if (isAuthenticated) {
            return <TodoContent setAuth={setAuth} />;
        } else {
            if (showLogin) {
                return <Login setAuth={setAuth} toggleAuthForm={toggleAuthForm} />;
            } else {
                return <Register setAuth={setAuth} toggleAuthForm={toggleAuthForm} />;
            }
        }
    };

    return (
        <div className="container">
            <Header 
                isAuthenticated={isAuthenticated} 
                setAuth={setAuth} 
                toggleAuthForm={toggleAuthForm} 
                showLogin={showLogin} 
            />
            
            {renderContent()}
        </div>
    );
}

export default App;