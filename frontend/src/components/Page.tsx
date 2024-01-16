import React, { useState } from 'react';
import Task from './Task';

interface TaskType {
  id: string;
  heading: string;
  description: string;
  completed: boolean;
}

interface PageProps {
  initialPageName: string;
}

const Page: React.FC<PageProps> = ({ initialPageName }) => {
  const [pageName, setPageName] = useState(initialPageName);
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: '1', heading: 'Task 1', description: 'Description 1', completed: false },
    { id: '2', heading: 'Task 2', description: 'Description 2', completed: true },
    // Add more tasks as needed
  ]);

  const handlePageNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPageName(event.target.value);
  };

  const handleTaskAdd = () => {
    const newTask: TaskType = {
      id: Math.random().toString(36).substring(7), // Generate a random string as id
      heading: 'New Task',
      description: 'Description',
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const handleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;

  return (
    <div>
      <h1>
        <input
          type="text"
          value={pageName}
          onChange={handlePageNameChange}
          placeholder="Page Name"
        />
      </h1>
      <p>Completed Tasks: {completedTasksCount}</p>

      <button onClick={handleTaskAdd}>Add Task</button>
      <div className='flex flex-wrap gap-16'>

      {tasks.map((task) => (
        <Task
          id={task.id}
          initialHeading={task.heading}
          initialDescription={task.description}
          completed={task.completed}
          onToggleCompletion={() => handleTaskCompletion(task.id)}
        />
      ))}

      </div>
    </div>
  );
};

export default Page;
