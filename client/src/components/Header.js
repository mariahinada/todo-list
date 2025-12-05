import React from 'react';

const Header = ({ isAuthenticated, setAuth }) => {

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        setAuth(false); 
    };

    const renderButtons = () => {
        if (isAuthenticated) {
            return (
                <button onClick={handleLogout}> 
                    Sair
                </button>
            );
        } else {
            return null; 
        }
    };

    return (
        <div className="header">
            <h1>Lista de Tarefas</h1>
            {renderButtons()}
        </div>
    );
};

export default Header;