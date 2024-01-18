import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../hooks/userContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/auth/password',
                { name, password },
                { withCredentials: true });
            const user = response.data.user;
            setUser(user); // Set the user in the context
            navigate('/'); // Redirect to the home page (or any desired page)
        } catch (error) {
            console.error('Login failed', error);
            // Handle login failure
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="button" onClick={handleLogin}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;