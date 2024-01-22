import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/userContext';
import { Button } from './button';
import axios from 'axios';

const Logout: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        // Call your backend endpoint to clear the user's authentication status
        await axios.post('/auth/logout');
    } catch (error) {
        console.error('Logout failed', error);
        // Handle error as needed
    } finally {
        // Redirect to the login page after logging out
        setUser(null);
        navigate('/');
    }
  };

  return (
    <Button className='w-1/6 mt-4 mr-4' onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
