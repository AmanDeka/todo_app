import React, { useState, useEffect, useRef } from 'react';
import './styles/global.css';
import Page from './components/Page';
import { ScrollArea } from './components/scrollarea';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, buttonVariants } from './components/button';
import { useUser } from './hooks/userContext';
import axios from 'axios';
import Login from './components/login';
import Signup from './components/signup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { cn } from './lib/utils';

const getPages = () => {
  const response = axios({
    url: '/data/page', method: 'GET', withCredentials: true,
  }).then(data => {
    return data.data;
  }).then(data => {
    return data.pages;
  });
  return response;
}

const addPage = (pageTitle: string) => {
  const response = axios({
    url: '/data/page', method: 'POST', withCredentials: true,
    data: {
      pageTitle: pageTitle
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const deletePage = (pageId: string) => {
  const response = axios({
    url: '/data/page', method: 'DELETE', withCredentials: true,
    data: {
      pageId: pageId
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const updatePageName = ({ pageId, pageTitle }: { pageId: string, pageTitle: string }) => {
  const response = axios({
    url: '/data/page', method: 'PUT', withCredentials: true,
    data: {
      pageId: pageId,
      newPageName: pageTitle
    }
  }).then(data => {
    return data.data;
  });
  return response;
}


const getUser = () => {
  console.log('getting user');
  const response = axios({
    url: '/auth/user', method: 'GET', withCredentials: true,
  }).then(data => {
    return data.data;
  }).then(data => {
    //if (!data.ok) throw new Error('Network Error');
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
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: quser, isSuccess: userSuccess } = useQuery({
    queryFn: getUser,
    queryKey: ['user'],

  });

  useEffect(() => {
    setUser(quser);
  }, [quser])


  const { data: pages, isLoading, isError, isSuccess: querySuccess, refetch } = useQuery({
    queryFn: getPages,
    queryKey: ['pages'],
    enabled: !!user,
    staleTime: Infinity,
    placeholderData: []
  });

  const addPageMutation = useMutation({
    mutationFn: addPage,
    onSuccess: () => {
      // Invalidate and refetch the user pages on success
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });

  const updatePageNameMutation = useMutation({
    mutationFn: updatePageName,
    onSuccess: (_, variables) => {
      // Invalidate and refetch the user pages on success
      console.log('Page name successfully updates');
      queryClient.setQueryData(['pages'], (prevData: PageType[] | undefined) => {
        if (prevData) {
          return prevData.map((page) =>
            page.id === variables.pageId ? { ...page, name: variables.pageTitle } : page
          );
        }
        return prevData;
      });
    },
  });

  const handleDeletePageMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: (_, variables) => {
      // Remove the deleted page from the 'pages' query data
      queryClient.setQueryData(['pages'], (prevData: PageType[] | undefined) => {
        if (prevData) {
          return prevData.filter((page) => page.id !== variables);
        }
        return prevData;
      });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        // Clicked outside the input, submit the rename
        if (editingPage) {
          const newPageName = inputRef.current.value;
          handleRenameSubmit(editingPage, newPageName);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingPage]);

  const handleAddPage = () => {
    const pageTitle = 'New Page Title'; // Replace with the actual title

    addPageMutation.mutate(pageTitle);
  };

  const handleUpdatePageName = async (pageId: string, pageTitle: string) => {
    await updatePageNameMutation.mutate({ pageId, pageTitle });
  };

  const handleRenameClick = (pageId: string) => {
    setEditingPage(pageId);
    // Set a small timeout to ensure the input is focused after the state has updated
  };

  const handleRenameSubmit = async (pageId: string, newPageName: string) => {
    handleUpdatePageName(pageId, newPageName);
    setEditingPage(null);
  };

  const handleDeletePage = async (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      await handleDeletePageMutation.mutate(pageId);
      setEditingPage(null);
    }
  };

  const cancelEdit = () => {
    setEditingPage(null);
  };




  if (user == null) {
    // User is not authorized
    return (
      <div className="app flex flex-col gap-4">
        <nav className="side-menu">
          <ul className='flex justify-center gap-4'>
            <li>
              <Link className={buttonVariants({ variant: "default" })} to="/login">Login</Link>
            </li>
            <li>
              <Link className={buttonVariants({ variant: "default" })} to="/signup">Signup</Link>
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
      <ScrollArea className="absolute top-0 left-0 h-full min-w-60 rounded-md border border-slate-500 p-4">
        Pages:
        <ul className='w-full items-center py-4'>
          {pages.map((page: PageType) => (
            <li key={page.id}>
              {editingPage === page.id ? (
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    defaultValue={page.name}
                    onBlur={() => handleRenameSubmit(page.id, inputRef.current?.value || '')}
                  />
                </div>
              ) : (
                <div className='w-full grid grid-cols-2 auto-cols-min gap-0'>
                  <Link className={cn(buttonVariants({ variant: "outline" }), 'w-48', 'p-4')} to={`/pages/${page.id}`}>{page.name}</Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant={'outline'} size={'icon'}><MoreVertical className='h-4 w-4' /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary border text-primary-foreground w-41 p-4">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='w-full'>
                        <Button onClick={() => handleRenameClick(page.id)}>Rename</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button onClick={() => handleDeletePage(page.id)}>Delete</Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </li>
          ))}
        </ul>
        <Button onClick={handleAddPage}>Add Page</Button>
      </ScrollArea>
      <div className='flex flex-col w-full'>
        <h1>Welcome {user.name}</h1>
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
    </div>
  );
}


export default App;
