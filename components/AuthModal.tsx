import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, registerUser, allUsers } = useData();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (mode === 'login') {
            // Admin login
            if (username.toLowerCase() === 'admin' && password === 'admin') {
                login('Nick Kraemer', 'admin');
                resetForm();
                onClose();
                return;
            }

            // Check if user exists
            const existingUser = allUsers.find(u =>
                u.username.toLowerCase() === username.toLowerCase() ||
                u.email.toLowerCase() === username.toLowerCase()
            );

            if (existingUser) {
                login(existingUser.username, existingUser.role);
                resetForm();
                onClose();
            } else if (username.length > 2) {
                // Demo mode: allow any username
                login(username, 'user');
                resetForm();
                onClose();
            } else {
                setError('Invalid credentials. Try admin/admin or register a new account.');
            }
        } else {
            // Registration validation
            if (!email.includes('@')) {
                setError('Please enter a valid email address');
                return;
            }
            if (username.length < 2) {
                setError('Username must be at least 2 characters');
                return;
            }
            if (password.length < 4) {
                setError('Password must be at least 4 characters');
                return;
            }

            // Check if email already exists
            const emailExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (emailExists) {
                setError('An account with this email already exists');
                return;
            }

            // Register new user
            registerUser(email, username, password, phone || undefined);
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setPhone('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-lg w-full max-w-sm p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

                <h2 className="text-2xl font-bold font-mono text-center mb-2 text-cyan-400">
                    {mode === 'login' ? 'CLIENT LOGIN' : 'CLIENT REGISTRATION'}
                </h2>
                <p className="text-center text-slate-500 text-xs mb-6">
                    {mode === 'login' ? 'Access your projects and profile' : 'Create your client account'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-1">
                                    EMAIL ADDRESS <span className="text-cyan-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded placeholder-slate-600"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-1">
                                    PHONE <span className="text-slate-600">(optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded placeholder-slate-600"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">
                            {mode === 'login' ? 'USERNAME OR EMAIL' : 'USERNAME'} <span className="text-cyan-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded"
                            autoFocus={mode === 'login'}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-mono border border-red-900/50 bg-red-900/10 p-2 text-center rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-4 rounded transition-all shadow-lg shadow-cyan-900/20 mt-4"
                    >
                        {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); resetForm(); }}
                        className="text-xs text-slate-500 hover:text-cyan-400 font-mono underline"
                    >
                        {mode === 'login' ? 'Create new account' : 'Already have an account? Sign in'}
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