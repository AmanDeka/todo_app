import React, { useState, useEffect } from 'react';
import './styles/global.css';
import Page from './components/Page';
import { ScrollArea } from './components/scrollarea';
import {  Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from './components/button';
import { useUser } from './hooks/userContext';
import axios from 'axios';
import Login from './components/login';
import Signup from './components/signup';

interface PageType {
  id: string;
  name: string;
}
function App() {
  const [pages, setPages] = useState<PageType[]>([
    { id: '1', name: 'Page 1' },
    { id: '2', name: 'Page 2' },
    // Add more pages as needed
  ]);

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios({
          url: '/auth/user',
          method: 'GET',
          withCredentials: true,
        });

        const userData = response.data.user;
        if (userData) {
          setUser(userData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAddPage = () => {
    const newPage: PageType = {
      id: Math.random().toString(36).substring(7),
      name: 'New Page',
    };
    setPages([...pages, newPage]);
  };

  if (user == null) {
    // User is not authorized
    return (
      <div className="app">
        <nav className="side-menu">
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    );
  }
  else {
    return (
      <div className="App fixed flex h-screen w-screen gap-10">
        <ScrollArea className="absolute top-0 left-0 h-full min-w-40 rounded-md border border-slate-500">
          <ul>
            {pages.map((page) => (
              <li key={page.id}>
                <Link to={`/pages/${page.id}`}>{page.name}</Link>
              </li>
            ))}
          </ul>
          <Button onClick={handleAddPage}>Add Page</Button>
        </ScrollArea>
        <div className="h-full w-full overflow-scroll">
          <Routes>
            {pages.map((page) => (
              <Route path={`/pages/:pageId`} element={<Page />} />
            ))}
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
