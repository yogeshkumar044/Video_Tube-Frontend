import React, { useState } from 'react';
import { ReactComponent as Logo } from '../logo.svg';
import { registerUser } from '../Utilis/AuthService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    avatar: null,
    coverImage: null,
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const signupData = new FormData();
    Object.entries(formData).forEach(([key, value]) => signupData.append(key, value));

    try {
      await registerUser(signupData);
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
      setFormData({
        username: '',
        email: '',
        fullName: '',
        avatar: null,
        coverImage: null,
        password: '',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-900 border-4 border-blue-900 rounded-2xl hover:border-blue-500 transition-all duration-200 p-6 w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <Logo className="h-12 w-12 text-white" />
          <h1 className="text-white text-2xl">Create Your Account</h1>
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSignup} className="space-y-4 w-full">
            {['username', 'email', 'fullName'].map((field) => (
              <input
                key={field}
                id={field}
                type={field === 'email' ? 'email' : 'text'}
                className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            ))}
            <div>
              <t>Avatar Image</t>
              <input
                id="avatar"
                type="file"
                className="w-full  bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
                onChange={handleChange}
                required
              />
            </div>
            <div>
            <t>Cover Image</t>
              <input
                id="coverImage"
                type="file"
                className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
                onChange={handleChange}
              />
            </div>
            <input
              id="password"
              type="password"
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className={`w-full p-2 bg-gray-50 rounded-full font-bold text-gray-900 border-4 border-gray-700 hover:border-blue-500 transition-all duration-200 ${loading ? 'disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-white mt-4">
            Already have an account?{' '}
            <a
              className="font-semibold text-white hover:text-blue-500 transition-all duration-200"
              href="/login"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
