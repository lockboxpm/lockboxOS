import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useData();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (mode === 'login') {
            if (username.toLowerCase() === 'admin' && password === 'admin') {
                login('Nick Kraemer', 'admin');
                onClose();
            } else if (username.length > 2) {
                // Allow any other user to login as 'user' for demo purposes
                login(username, 'user');
                onClose();
            } else {
                setError('Invalid credentials. Try admin/admin');
            }
        } else {
            // Simulating registration
            login(username, 'user');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-lg w-full max-w-sm p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

                <h2 className="text-2xl font-bold font-mono text-center mb-6 text-cyan-400">
                    {mode === 'login' ? 'SYSTEM LOGIN' : 'NEW USER REGISTRATION'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">IDENTIFIER / USERNAME</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">ACCESS KEY / PASSWORD</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-mono border border-red-900/50 bg-red-900/10 p-2 text-center">
                            [ERROR]: {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition-all shadow-lg shadow-cyan-900/20 mt-4"
                    >
                        {mode === 'login' ? 'AUTHENTICATE' : 'REGISTER ID'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-xs text-slate-500 hover:text-cyan-400 font-mono underline"
                    >
                        {mode === 'login' ? 'Create new identity' : 'Return to login'}
                    </button>
                </div>

                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-slate-600 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    );
};

export default AuthModal;