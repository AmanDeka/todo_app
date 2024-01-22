import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../hooks/userContext';
import { Input } from './input';
import { Button } from './button';

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
        <div className='w-full h-full flex justify-center'>
            <form className='w-1/2 flex flex-col border rounded-md border-slate-500 items-center space-y-4 p-4'>
            <h2>Login</h2>
                <label>
                    Name:
                    <Input type="text" placeholder = "Username" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <Input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <Button type="button" onClick={handleLogin} variant={'default'}>
                    Login
                </Button>
            </form>
        </div>
    );
};

export default Login;