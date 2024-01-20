import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Task from './Task';
import { useQueryClient ,useQuery,useMutation} from '@tanstack/react-query';
import axios from 'axios';

interface TaskType {
  id:string
  name: string;
  description: string;
  completed: boolean;
}

const getTasks = (pageId: string|undefined) => {
  const response = axios({
    url: '/data/task', method: 'GET', withCredentials: true,
    data: {
      pageId: pageId
    }
  }).then(data => {
    return data.data;
  }).then(data => {
    return data.tasks;
  });
  return response;
}

const addTask = ({taskTitle,taskDescription,completed,pageId}:
  {taskTitle: string,taskDescription:string,completed:boolean,pageId:string|undefined}) => {
  const response = axios({
    url: '/data/task', method: 'POST', withCredentials: true,
    data: {
      taskTitle: taskTitle,
      taskDescription:taskDescription,
      completed:completed,
      pageId:pageId
    }
  }).then(data => {
    return data.data;
  });
  return response;
}

const changeTaskCompletion = ({taskId,newTaskCompletion}:{taskId:string,newTaskCompletion:boolean}) => {
  const response = axios({
    url: '/data/task/completion', method: 'PUT', withCredentials: true,
    data: {
      taskId:taskId,
      newTaskCompletion:newTaskCompletion
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
    queryFn: ()=>{return getTasks(pageId)},
    queryKey: ['task',pageId],
    staleTime: Infinity,
    placeholderData: []
  });

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      // Invalidate and refetch the user pages on success
      queryClient.invalidateQueries({ queryKey: ['task',pageId] });
    },
  });

  const taskCompletionMutation = useMutation({
    mutationFn: changeTaskCompletion,
    onSuccess: (_, variables) => {
      // Remove the deleted page from the 'pages' query data
      queryClient.setQueryData(['task',pageId], (prevData: TaskType[] | undefined) => {
        if (prevData) {
          return prevData.map((task) =>
            task.id === variables.taskId ? { ...task, completed: variables.newTaskCompletion } : task
          );
        }
        return prevData;
      });
    },
  });


  const handleTaskAdd = () => {
    addTaskMutation.mutate({taskTitle:'New Task',taskDescription:'Description',completed:false,pageId:pageId});
  };

  const handleTaskCompletion = (taskId: string,newTaskCompletion:boolean) => {
      taskCompletionMutation.mutate({taskId,newTaskCompletion});
  };

  const completedTasksCount = tasks.filter((task:TaskType) => task.completed).length;

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

        {tasks.map((task:TaskType) => (
          <Task
            id={task.id}
            initialHeading={task.name}
            initialDescription={task.description}
            completed={task.completed}
            onToggleCompletion={() => handleTaskCompletion(task.id,!task.completed)}
          />
        ))}

      </div>
    </div>
  );
};

export default Page;
