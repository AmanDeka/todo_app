import React, { useState } from 'react';
import Task from './components/Task';
import './styles/global.css';
import Page from './components/Page';
import { ScrollArea, ScrollBar } from './components/scrollarea';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button } from './components/button';

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

  const handleAddPage = () => {
    const newPage: PageType = {
      id: Math.random().toString(36).substring(7),
      name: 'New Page',
    };
    setPages([...pages, newPage]);
  };
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

export default App;
