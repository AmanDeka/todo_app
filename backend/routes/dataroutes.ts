import express, { Request, Response } from "express";
import { getPageByUserId, insertPage, updatePageName,deletePage } from "../models/page";

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

export default dataroutes;