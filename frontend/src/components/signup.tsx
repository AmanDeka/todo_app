import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './input';
import { buttonVariants } from './button';

interface SignUpFormData {
    name: string;
    password: string;
}

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Assume you have a backend API endpoint for user registration
        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Registration successful, redirect to login page
                navigate('/login');
            } else {
                // Handle registration failure (e.g., display error message)
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration', error);
        }
    };

    return (
        <div className='w-full h-full flex justify-center'>
            <form onSubmit={handleSubmit} className='w-1/2 flex flex-col border rounded-md border-slate-500 items-center space-y-4 p-4'>
                <h2>Signup Page</h2>
                <label htmlFor="name">Name:
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Username'
                        required
                    />
                </label>


                <label htmlFor="password">Password:
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>


                <button className={buttonVariants({ variant: "default" })} type="submit">Sign Up</button>

            </form>
        </div>
    );
};

export default Signup;