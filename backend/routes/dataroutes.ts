import express, { Request, Response } from "express";
import { getPageByUserId, insertPage, updatePageName,deletePage } from "../models/page";
import { getTaskByPageId,insertTask ,updateTaskName,updateTaskDesc,updateTaskCompletion,deleteTask} from "../models/task";

const dataroutes = express.Router();

interface User {
    id?: string;
    name?: string;
    password?: string;
}

dataroutes.get('/page', async (req: Request, res: Response) => {
    try {
        let userId: string | null = null;
        if (req.user) {
            if ('id' in req.user && typeof req.user.id == "string") userId = req.user.id;
        }

        if (!userId) {
            return res.status(400).json({ success: false, error: 'UserId is required in the request body.' });
        }

        console.log(userId);
        // Fetch user's pages
        const userPages = await getPageByUserId(userId);


        res.status(200).json({ success: true, pages: userPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.post('/page', async (req: Request, res: Response) => {
    try {
        const { pageTitle } = req.body;

        let userId: string | null = null;
        if (req.user) {
            if ('id' in req.user && typeof req.user.id == "string") userId = req.user.id;
        }

        if (!userId || !pageTitle) {
            return res.status(400).json({ success: false, error: 'UserId, pageTitle, and pageContent are required in the request body.' });
        }

        // Insert the new page into the database
        const newPage = insertPage({ name: pageTitle, userId: userId });

        res.status(201).json({ success: true, page: newPage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.put('/page', async (req: Request, res: Response) => {
    try {
        const { pageId, newPageName } = req.body;

        if (!pageId || !newPageName) {
            return res.status(400).json({ success: false, error: 'PageId and newPageName are required in the request body.' });
        }

        // Update the page name in the database
        const updatedPage = updatePageName(pageId, newPageName);

        res.status(200).json({ success: true, page: updatedPage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.delete('/page', async (req:Request, res:Response) => {
    try {
      const { pageId } = req.body;
  
      if (!pageId) {
        return res.status(400).json({ success: false, error: 'PageId is required in the request parameters.' });
      }
  
      // Delete the page in the database
      const deletedPage = deletePage(pageId);
  
      res.status(200).json({ success: true, deletedPage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


  dataroutes.get('/task', async (req: Request, res: Response) => {
    try {
        const {pageId} = req.body;

        if (!pageId) {
            return res.status(400).json({ success: false, error: 'PageId is required in the request body.' });
        }

        // Fetch user's pages
        const userTasks = await getTaskByPageId(pageId);


        res.status(200).json({ success: true, tasks: userTasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.post('/task', async (req: Request, res: Response) => {
    try {
        const { taskTitle,taskDescription,completed,pageId } = req.body;


        if (!pageId || !taskTitle || !taskDescription) {
            return res.status(400).json({ success: false, error: 'UserId, pageTitle, and pageContent are required in the request body.' });
        }


        const newTask = insertTask({ name: taskTitle, pageId: pageId,completed:completed,description:taskDescription });

        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.put('/task/name', async (req: Request, res: Response) => {
    try {
        const { taskId, newTaskName } = req.body;

        if (!taskId || !newTaskName) {
            return res.status(400).json({ success: false, error: 'PageId and newPageName are required in the request body.' });
        }

        // Update the page name in the database
        const updatedTask = updateTaskName(taskId, newTaskName);

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.put('/task/description', async (req: Request, res: Response) => {
    try {
        const { taskId, newTaskDesc } = req.body;

        if (!taskId || !newTaskDesc) {
            return res.status(400).json({ success: false, error: 'PageId and newPageName are required in the request body.' });
        }

        // Update the page name in the database
        const updatedTask = updateTaskDesc(taskId, newTaskDesc);

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.put('/task/completion', async (req: Request, res: Response) => {
    try {
        const { taskId, newTaskCompletion } = req.body;

        if (!taskId || !newTaskCompletion) {
            return res.status(400).json({ success: false, error: 'PageId and newPageName are required in the request body.' });
        }

        // Update the page name in the database
        const updatedTask = updateTaskCompletion(taskId, newTaskCompletion);

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

dataroutes.delete('/task', async (req:Request, res:Response) => {
    try {
      const { taskId } = req.body;
  
      if (!taskId) {
        return res.status(400).json({ success: false, error: 'PageId is required in the request parameters.' });
      }
  
      // Delete the page in the database
      const deletedTask = deleteTask(taskId);
  
      res.status(200).json({ success: true, deletedTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

export default dataroutes;