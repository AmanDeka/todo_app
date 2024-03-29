import express, { Response, Request } from 'express';
import passport from '../passport';
import bcrypt from 'bcrypt';
import { insertUser } from '../models/user';

interface User{
    id?:string;
    name?:string;
    password?:string;
}

const authroutes = express.Router();


authroutes.post('/password', passport.authenticate('local'), (req: Request, res: Response) => {
    if (req.user) res.json({ user: req.user });
})

authroutes.get('/user', (req: Request, res: Response) => {
    if (req.user) res.json({ user: req.user });
    else res.json({ user: null });
})

authroutes.post('/logout', function (req: Request, res: Response, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Logout successful' });;
    });
});

authroutes.post('/signup', async (req: Request, res: Response) => {
    const { name, password } = req.body;

    console.log(name,password)

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);



        const user = {
            name: name,
            password: hashedPassword
        }


        insertUser(user);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default authroutes;