const { Router } = require("express")
const bcrypt = require("bcrypt")

const { addNewUser,
    retreiveAllUsers,
    retreiveuserById,
    searchForUser,
    updateUserInfo,
    deleteUserById, 
    retreiveByEmail,
    updateUserSettings,
    updateUserpassword} = require("../../models/user");
const validation = require("../../middlewares/validation")
const { newUserSchema, searchUserSchema, idURLSchema,editUserSchema, loginSchema, editUserSettingsSchema, passwordChangechema } = require("./users.validationSchema");
const errorHandler = require("../../utils/errorHandler");
const HTTPError = require("../../utils/HTTPError");

const userRouter = Router();

userRouter.get("/", async (req, res, next) => {
    try {
        const users = await retreiveAllUsers();
        res.status(200).json({ users })
    } catch (error) {
        error.message = 'Error while retreiving the users';
        error.statusCode = error.statusCode || 500;
        next(error)
    }
})

userRouter.post("/new", validation(newUserSchema), async (req, res, next) => {
    const { name,password, email, phone,start_working_day, notes, role } = req.body;
    try {
        const emailExist = await retreiveByEmail(email)
        if (emailExist){
            throw new HTTPError(400,"Email is Already exist")
        }
        const hashedPassword = await bcrypt.hash(password, +process.env.HASH_SALT)
        const result = await addNewUser(name, hashedPassword, email, phone, start_working_day, notes, role)
        if (result)
            res.status(201).json({ done: true })
        else
            throw new Error();
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

userRouter.get("/all", async (req, res, next) => {
    try {
        const users = await retreiveAllUsers();
        res.status(200).json({ users })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

userRouter.post("/login", async (req, res, next) => {
    try {
        const { email,password } = req.body;
        const user = await retreiveByEmail(email);
        if (!user){
            console.log("user not exist")
            throw new HTTPError(401,"UserName Or password is not valid")
        }
            
        const validPassword=await bcrypt.compare(password,user.password)
        if (!validPassword){
            console.log("invalid password")
            throw new HTTPError(401, "UserName Or password is not valid")
        }

        req.session.user = {
             id: user.id,
             name:user.name,
             email: user.email, 
             phone:user.phone,
             role:user.role }
 
        res.status(200).json({done:"true"})
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

userRouter.post('/logout', (req, res,next) => {
    // Destroy the session to log the user out
    req.session.destroy(error => {
        if (error) {
            console.log(error);
        }
        });
        res.redirect(`/dashboard/login`)
});

userRouter.get("/search", validation(searchUserSchema), async (req, res, next) => {
    const { name, email, start_working_day, notes, role } = req.query;
    try {
        const users = await searchForUser(name, email, start_working_day, notes, role)
        res.json({ users })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

//Changed by admin of system containing (name, email, phone, role, working day, add notes about user)
userRouter.patch("/edit/:id", validation(editUserSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email,phone, start_working_day, notes, role } = req.body;
        const count = await updateUserInfo(id, name, email, phone, start_working_day, role, notes);
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})


userRouter.patch("/change-password/:id", validation(passwordChangechema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentPassword,newPassword } = req.body;
        const user = await retreiveuserById(id)
        if(!user)throw new HTTPError(400, "Invalid user ID")
        const validPassword=await bcrypt.compare(currentPassword,user.password)
        if (!validPassword) throw new HTTPError(403, "Old password is wrong")
        const count = await updateUserpassword(id, newPassword);
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

//user change his own settings (name,email, phone)
userRouter.patch("/editSettings/:id", validation(editUserSettingsSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const count = await updateUserSettings(id, name, email, phone);
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

userRouter.delete("/delete/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const count = await deleteUserById(id);
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

userRouter.get("/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await retreiveuserById(id);
        if (user !== null)
            res.status(200).json(user)
        else
            res.status(404).json({ error: "User Not Found" });
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

module.exports = userRouter;