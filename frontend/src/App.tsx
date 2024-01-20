import React, { useState, useEffect } from 'react';
import './styles/global.css';
import Page from './components/Page';
import { ScrollArea } from './components/scrollarea';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from './components/button';
import { useUser } from './hooks/userContext';
import axios from 'axios';
import Login from './components/login';
import Signup from './components/signup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const getPages = () => {
  const response = axios({url: '/data/page',method: 'GET',withCredentials: true,
  }).then(data => {
    return data.data;
  }).then(data => {
    return data.pages;
  });
  return response;
}

const addPage = (pageTitle: string) => {
  const response = axios({url: '/data/page',method: 'POST',withCredentials: true,
    data: {
      pageTitle: pageTitle
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const getUser = () => {
  const response = axios({url: '/auth/user',method: 'GET',withCredentials: true,
  }).then(data => {
    return data.data;
  }).then(data => {
    if(!data.ok)throw new Error('Network Error');
    return data.user
  });
  //if (response == null) throw 'user not found';
  return response;
}

interface PageType {
  id: string;
  name: string;
}
function App() {
  //const [pages, setPages] = useState<PageType[]>([]);

  const { user, setUser } = useUser();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);

  const handleAddPage = () => {
    const pageTitle = 'New Page Title'; // Replace with the actual title
    const pageContent = 'New Page Content'; // Replace with the actual content

    addPageMutation.mutate(pageTitle);
  };
 

  const { data: quser, isSuccess: userSuccess } = useQuery({
    queryFn: getUser,
    queryKey: ['user'],

  });

  useEffect(() => {
    setUser(quser);
  }, [quser])


  const { data: pages, isLoading, isError, isSuccess: querySuccess } = useQuery({
    queryFn: getPages,
    queryKey: ['pages'],
    enabled: !!user,
    placeholderData: []
  });

  const addPageMutation = useMutation({
    mutationFn: addPage,
    onSuccess: () => {
      // Invalidate and refetch the user pages on success
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });

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



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (querySuccess) {
    console.log('pages', pages);
  }


  return (
    <div className="App fixed flex h-screen w-screen gap-10">
      <p>{user.name}</p>
      <ScrollArea className="absolute top-0 left-0 h-full min-w-40 rounded-md border border-slate-500">
        <ul>
          {
            (typeof pages != 'undefined')
              ?
              (
                pages.map((page: PageType) => (
                  <li key={page.id}>
                    <Link to={`/pages/${page.id}`}>{page.name}</Link>
                  </li>
                )))

              :
              ([])
          }
        </ul>
        <Button onClick={handleAddPage}>Add Page</Button>
      </ScrollArea>
      <div className="h-full w-full overflow-scroll">
        <Routes>
          {
            (typeof pages != 'undefined')
              ?
              (pages.map((page: PageType) => (
                <Route path={`/pages/:pageId`} element={<Page />} />
              ))
              )
              :
              ([])
          }
        </Routes>
      </div>
    </div>
  );
}


export default App;
