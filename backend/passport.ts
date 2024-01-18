import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { getUserByName,getUserById } from './mongo';

interface User{
    id?:string;
    name?:string;
    password?:string;
}


passport.use(
    new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
        try {
            // Fetch the user by email
            const user = await getUserByName(name,true);

            console.log(name,password);

            if (user == null) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            // Compare the provided password with the hashed password from the database
            let isPasswordMatch = undefined;
            if (user.password) {
                isPasswordMatch = await bcrypt.compare(password, user.password);
            }

            if (!isPasswordMatch) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            // If the password matches, return the user object
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user:User, done) => {
    console.log("Serialize",user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id:string, done) => {
    try {
      // Implement a function to fetch the user by ID from your database
      const user = await getUserById(id,false);
  
      if (user!=null) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });
  

export default passport;