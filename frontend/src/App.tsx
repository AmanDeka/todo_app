import React from 'react';
import Task from './components/Task';
import './styles/global.css';
import Page from './components/Page';
import { ScrollArea, ScrollBar} from './components/scrollarea';

function App() {
  return (
    <div className="App flex h-screen">
      <ScrollArea className="h-full w-48 rounded-md border border-slate-500">
      </ScrollArea>
      <Page initialPageName='Page1'/>
    </div>
  );
}

export default App;
