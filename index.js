const express = require("express");
const path = require("path");
const fs = require("fs");
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')

const messageRouter = require("./controllers/messages/message.router");
const menuTypeRouter = require("./controllers/menu_type/menu_type.router");
const menuRouter = require("./controllers/menu/menu.router");
const userRouter = require("./controllers/users/user.router");
const orderRouter = require("./controllers/order/order.router");
const PagesRouter = require("./controllers/template-engine/pages.router");
const dashboardPagesRouter = require("./controllers/template-engine/dashboard-pages.router");

const deleteFile = require("./utils/deleteFile");
const rootPath = require("./utils/rootPath");

const app = express();

app.set('view engine', 'ejs');
// app.set('view options', { debug: true }); // Enable debug mode For "EJS" Template Engines
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds
        // secure: true, // Set the secure flag to true for HTTPS only
        sameSite: 'strict' // Restrict the cookie to the same site
    }
}));

app.use(express.static(path.join(rootPath, 'public')))
app.use('/public', express.static(path.join(rootPath, 'public')))

// -----------------------------------   Routing Operations ---------------------------------------------------
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/menu-type", menuTypeRouter)
app.use("/api/v1/menu", menuRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/order", orderRouter)

app.use("/", PagesRouter) //To handle Pages Requests
app.use("/dashboard", dashboardPagesRouter) //To handle Pages Requests

// -------------------------------   Not Found Page function -------------------------------------------------
function pageNotFoundHandler(req, res, next) {
    const language = req.cookies.language || "en";
    const tagline = language !== "ar" ? "Page Not Found" : "الصفحه غير موجوده"
    res.status(404).render("pages/404", {
        tagline,
        language
    })
}

app.use("*", pageNotFoundHandler)

// -------------------------------   Application Error Handler -------------------------------------------------
function errorHandler(customError, request, response, next) {
    if (request.file?.path) {//if there is file uploaded during this request delete it because this request cause error
        deleteFile(request.file.path)
    }

    if (request.files) {//if there are files uploaded during this request delete them becaue this request cause error
        for (let index = 0; index < request.files.length; index++) {
            if (request.files[index].path) {
                deleteFile(request.files[index].path)
            }
        }
    }

    response.status(customError.statusCode || 400)
        .json({ error_message: customError.message || "Invalid Operation" });
}

app.use(errorHandler)

// ----------------------------------------   Start HTTP Server --------------------------------------------------
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})