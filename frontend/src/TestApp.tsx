import React from 'react';
import './index.css';

const TestApp: React.FC = () => {
    return (
        <div style={{ padding: '50px', color: 'white', fontSize: '24px' }}>
            <h1>React is Working!</h1>
            <p>If you see this, React is mounting correctly.</p>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
                <p>Background gradient should be visible</p>
                <p>Text should be white</p>
            </div>
        </div>
    );
};

export default TestApp;
