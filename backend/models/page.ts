import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Page {
    name: string;
    userId: string;
}

export const getPageByUserId = async (userId: string) => {
    try {
        const pages = await prisma.pages.findMany({
            select: {
                id: true,
                name: true
            },
            where: {
                userId: userId
            }
        })
        console.log('pages',pages);
        return pages;
    }
    catch (e) {
        throw e;
    }
}

export const insertPage = async (page: Page) => {
    try {
        const ret = await prisma.pages.create({
            data: page
        });
        return ret;
    }
    catch (e) {
        throw e;
    }
}

export const updatePageName = async (id:string,newName:string) => {

}