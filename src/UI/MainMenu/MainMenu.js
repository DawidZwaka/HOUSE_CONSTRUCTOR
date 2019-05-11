import React from 'react';
import './MainMenu.css';

const mainMenu = () =>{
    return (
        <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            transform: 'translateY(30%)',
        }}>
            <h1 style={{
                fontWeight: '100',
                width: '100%',
                margin: 0,
                lineHeight: 1,
            }}
            >House Customizer</h1>
            <div className="burgerMenu">
            </div>
        </div>
    ); 
}

export default mainMenu;