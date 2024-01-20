import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Task {
    name:string;
    pageId:string;
    completed:boolean;
    description:string;
}

export const getTaskByPageId = async (pageId: string) => {
    try {
        const pages = await prisma.tasks.findMany({
            select: {
                id: true,
                name: true,
                description:true,
                completed:true
            },
            where: {
                pageId: pageId
            }
        })
        return pages;
    }
    catch (e) {
        throw e;
    }
}

export const insertTask = async (task: Task) => {
    try {
        const ret = await prisma.tasks.create({
            data: task
        });
        return ret;
    }
    catch (e) {
        throw e;
    }
}

export const updateTaskName = async (id: string, newName: string) => {
    try {
        const ret = await prisma.tasks.update({
            where: {
                id: id
            },
            data: {
                name: newName
            }
        });
        return ret;
    }
    catch (e) {
        throw e;
    }
}

export const updateTaskDesc = async (id: string, newDesc: string) => {
    try {
        const ret = await prisma.tasks.update({
            where: {
                id: id
            },
            data: {
                description: newDesc
            }
        });
        return ret;
    }
    catch (e) {
        throw e;
    }
}

export const updateTaskCompletion = async (id: string, completed: boolean) => {
    try {
        const ret = await prisma.tasks.update({
            where: {
                id: id
            },
            data: {
                completed: completed
            }
        });
        return ret;
    }
    catch (e) {
        throw e;
    }
}

export const deleteTask = async (id: string) => {
    try {
        const ret = await prisma.tasks.delete({
            where: {
                id: id
            },
        });
        return ret;
    }
    catch (e) {
        throw e;
    }
}