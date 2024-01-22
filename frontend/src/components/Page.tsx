import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Task from './Task';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from './button';

interface TaskType {
  id: string
  name: string;
  description: string;
  completed: boolean;
}

const getTasks = (pageId: string | undefined) => {
  console.log('get tasks', typeof pageId);
  const response = axios({
    url: '/data/task', method: 'GET',
    params: {
      pageId: pageId,
    }
  }).then(data => {
    return data.data;
  }).then(data => {
    return data.tasks;
  });
  return response;
}

const addTask = ({ taskTitle, taskDescription, completed, pageId }:
  { taskTitle: string, taskDescription: string, completed: boolean, pageId: string | undefined }) => {
  const response = axios({
    url: '/data/task', method: 'POST', withCredentials: true,
    data: {
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      completed: completed,
      pageId: pageId
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const deleteTask = (taskId: string) => {
  const response = axios({
    url: '/data/task', method: 'DELETE', withCredentials: true,
    data: {
      taskId: taskId
    }
  }).then(data => {
    return data.data;
  });
  return response;
}


const changeTaskCompletion = ({ taskId, newTaskCompletion }: { taskId: string, newTaskCompletion: boolean }) => {
  const response = axios({
    url: '/data/task/completion', method: 'PUT', withCredentials: true,
    data: {
      taskId: taskId,
      newTaskCompletion: newTaskCompletion
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const updateTaskName = ({ taskId, newTaskName }: { taskId: string, newTaskName: string }) => {
  const response = axios({
    url: '/data/task/name', method: 'PUT', withCredentials: true,
    data: {
      taskId: taskId,
      newTaskName: newTaskName
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const updateTaskDescription = ({ taskId, newTaskDesc }: { taskId: string, newTaskDesc: string }) => {
  const response = axios({
    url: '/data/task/description', method: 'PUT', withCredentials: true,
    data: {
      taskId: taskId,
      newTaskDesc: newTaskDesc
    }
  }).then(data => {
    return data.data;
  });
  return response;
}


const Page: React.FC = () => {
  const { pageId } = useParams();
  //const [tasks, setTasks] = useState<TaskType[]>([]);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, isError, isSuccess: querySuccess } = useQuery({
    queryFn: () => { return getTasks(pageId) },
    queryKey: ['task', pageId],
    staleTime: 0,
    placeholderData: [],
  });

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', pageId] });
    },
  });

  const handleDeleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, variables) => {

      queryClient.setQueryData(['task', pageId], (prevData: TaskType[] | undefined) => {
        if (prevData) {
          return prevData.filter((task) => task.id !== variables);
        }
        return prevData;
      });
    },
  });

  const taskCompletionMutation = useMutation({
    mutationFn: changeTaskCompletion,
    onSuccess: (_, variables) => {

      queryClient.setQueryData(['task', pageId], (prevData: TaskType[] | undefined) => {
        if (prevData) {
          return prevData.map((task) =>
            task.id === variables.taskId ? { ...task, completed: variables.newTaskCompletion } : task
          );
        }
        return prevData;
      });
    },
  });

  const updateTaskNameMutation = useMutation({
    mutationFn: updateTaskName,
    onSuccess: (_, variables) => {

      console.log('Task name successfully updates');
      queryClient.setQueryData(['task', pageId], (prevData: TaskType[] | undefined) => {
        if (prevData) {
          return prevData.map((task) =>
            task.id === variables.taskId ? { ...task, name: variables.newTaskName } : task
          );
        }
        return prevData;
      });
    },
  });

  const updateTaskDescriptionMutation = useMutation({
    mutationFn: updateTaskDescription,
    onSuccess: (_, variables) => {

      console.log('Task Description successfully updates');
      queryClient.setQueryData(['task', pageId], (prevData: TaskType[] | undefined) => {
        if (prevData) {
          return prevData.map((task) =>
            task.id === variables.taskId ? { ...task, description: variables.newTaskDesc } : task
          );
        }
        return prevData;
      });
    },
  });


  const handleTaskAdd = () => {
    addTaskMutation.mutate({ taskTitle: 'New Task', taskDescription: 'Description', completed: false, pageId: pageId });
  };

  const handleTaskCompletion = (taskId: string, newTaskCompletion: boolean) => {
    taskCompletionMutation.mutate({ taskId, newTaskCompletion });
  };

  const handleTaskTitleChange = (taskId: string, newTaskName: string) => {
    updateTaskNameMutation.mutate({ taskId: taskId, newTaskName: newTaskName });
  }

  const handleTaskDescriptionChange = (taskId: string, newTaskDesc: string) => {
    updateTaskDescriptionMutation.mutate({ taskId: taskId, newTaskDesc: newTaskDesc });
  }

  const handleDeleteTask = (taskId: string) => {
    handleDeleteTaskMutation.mutate(taskId);
  }

  const completedTasksCount = (typeof tasks == 'object') ? tasks.filter((task: TaskType) => task.completed).length : 0;
  console.log(tasks);
  return (
    <div className='w-full flex flex-col gap-y-10'>
      <p className='text-3xl'>Your Tasks:</p>
      {(completedTasksCount!=0 && completedTasksCount == tasks.length)
      ?<p className='text-lg text-green-700'>All tasks Completed !</p>
      :<p className='text-lg'>Completed Tasks: {completedTasksCount}</p>
      }
      <Button className='w-1/6' onClick={handleTaskAdd}>Add Task</Button>
      <div className='flex flex-wrap gap-16'>

        {tasks.map((task: TaskType) => (
          <Task
            key={task.id}
            id={task.id}
            initialHeading={task.name}
            initialDescription={task.description}
            completed={task.completed}
            onToggleCompletion={() => handleTaskCompletion(task.id, !task.completed)}
            onTitleChange={(newTitle: string) => handleTaskTitleChange(task.id, newTitle)}
            onDescriptionChange={(newDescription: string) => handleTaskDescriptionChange(task.id, newDescription)}
            onDelete={(taskId: string) => handleDeleteTask(taskId)}
          />
        ))}

      </div>
    </div>
  );
};

export default Page;
