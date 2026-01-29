import React from 'react';
import './index.css';
import './App.css';

const SimpleLogin: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
                <h2>FamEmergency Login</h2>
                <p>Simple test login page</p>
                <form>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#3b82f6',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SimpleLogin;
