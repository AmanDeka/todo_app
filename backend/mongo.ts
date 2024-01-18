import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

interface User{
    password:string;
    name:string;
}

export const getUserByName = async (name:string,password:boolean) => {
    try{
        const user = await prisma.users.findUnique({
            where:{
                name:name
            },
            select:{
                name:true,
                id:true,
                password:password
            }
        });
        return user;
    }
    catch(e){
        throw e;
    }
}

export const getUserById = async (id:string,password:boolean) => {
    try{
        const user = await prisma.users.findUnique({
            where:{
                id:id
            },
            select:{
                name:true,
                id:true,
                password:password
            }
        });
        return user;
    }
    catch(e){
        throw e;
    }
}

export const insertUser = async (user:User) => {
    try{
        await prisma.users.create({
            data:user
        });
    }
    catch(e){
        throw e;
    }
}