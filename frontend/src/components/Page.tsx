import React, { useState} from 'react';
import { useParams } from 'react-router-dom';
import Task from './Task';

interface TaskType {
  id: string;
  heading: string;
  description: string;
  completed: boolean;
}


const Page: React.FC = () => {
  const {pageId} = useParams();
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: '1', heading: 'Task 1', description: 'Description 1', completed: false },
    { id: '2', heading: 'Task 2', description: 'Description 2', completed: true },
    // Add more tasks as needed
  ]);


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
          value={pageId}
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
