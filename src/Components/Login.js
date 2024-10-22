import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { LoginContext } from '../Context/LoginContext';

const Login = () => {
    const { setIsLoggedIn } = useContext(LoginContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const isEmail = identifier.includes('@');

        try {
            const { data } = await axios.post('http://localhost:8000/api/v1/users/login', {
                [isEmail ? 'email' : 'username']: identifier,
                password,
            });

            const { accessToken} = data.data;
            localStorage.setItem('authToken', accessToken);
            // localStorage.setItem('user', JSON.stringify(user));
            
            setIsLoggedIn(true);
            navigate('/'); // Redirect to home or any other page
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-900 border-4 border-blue-900 rounded-2xl p-6 w-full max-w-md transition duration-200 ease-in-out transform hover:border-blue-500">
                <div className="flex flex-col items-center space-y-4">
                    <Logo className="h-12 w-12 text-white" />
                    <h1 className="text-2xl text-white">Login</h1>
                    {error && <div className="text-center text-red-500 mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div>
                            <label htmlFor="identifier" className="block text-white">Username or Email</label>
                            <input
                                type="text"
                                id="identifier"
                                className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 text-white transition duration-200 ease-in-out hover:border-blue-500"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-white">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 text-white transition duration-200 ease-in-out hover:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full p-2 bg-gray-50 rounded-full font-bold text-gray-900 border-4 border-gray-700 transition duration-200 ease-in-out transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className="text-white mt-4">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className="font-semibold text-white transition duration-200 ease-in-out transform hover:text-blue-500"
                        >
                            Sign up
                        </Link>
                    </p>
                    <p className="text-white mt-4">
                        <Link
                            to="#"
                            className="font-semibold text-white transition duration-200 ease-in-out transform hover:text-blue-500"
                        >
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
