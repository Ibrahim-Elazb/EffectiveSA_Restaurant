const { isAuthorized, roles } = require("../../middlewares/authentication");
const { retreiveAllMenuItems } = require("../../models/menu");
const { retreiveAllMenuTypes } = require("../../models/menu_type");
const { retreiveMessagesByPage } = require("../../models/message");
const { retreiveOrdersByPage } = require("../../models/order");
const { retreiveAllUsers } = require("../../models/user");

const { dateTimeFornmatter }=require("../../utils/dateFormatter")

const dashboardPagesRouter = require("express").Router();

dashboardPagesRouter.get("/", isAuthorized([roles.cashierRole,roles.adminRole]), (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Dashboard"
        res.render("pages/dashboard/main", {
            tagline,
            user: req.session.user,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/messages", isAuthorized([roles.cashierRole, roles.adminRole]), async (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Dashboard"
        const messages = await retreiveMessagesByPage(1)
        const messagesCount = messages[0].total_count
        messages.forEach(item => {
            item.date = dateTimeFornmatter(item.date)
        })
        
        res.render("pages/dashboard/messages", {
            tagline,
            user: req.session.user,
            messages,
            messagesCount,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/orders", isAuthorized([roles.cashierRole, roles.adminRole]), async(req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "orders"
        const ordersList = await retreiveOrdersByPage(1)
        const ordersCount = ordersList[0].total_count
        ordersList.forEach(item => {
            item.date = dateTimeFornmatter(item.date)
        })
        res.render("pages/dashboard/orders", {
            tagline,
            user: req.session.user,
            language,
            ordersCount,
            ordersList
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/menu", isAuthorized([roles.cashierRole, roles.adminRole]), async (req, res, next) => {
    try {
        const menuItems = await retreiveAllMenuItems();
        const menuTypes = await retreiveAllMenuTypes();
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Menu"
        res.render("pages/dashboard/menu", {
            tagline,
            user: req.session.user,
            menuItems,
            menuTypes,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/menu-types", isAuthorized([roles.cashierRole, roles.adminRole]), async (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Menu Types"
        const menuTypes = await retreiveAllMenuTypes()
        res.render("pages/dashboard/menu-types", {
            tagline,
            user: req.session.user,
            menuTypes,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/users", isAuthorized([roles.adminRole]), async (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Users"
        const usersList = await retreiveAllUsers()
        usersList.forEach(item => {
            item.start_working_day = new Date(item.start_working_day)
                .toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
        })
        res.render("pages/dashboard/users", {
            tagline,
            user: req.session.user,
            usersList,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/settings", isAuthorized([roles.cashierRole, roles.adminRole]), async (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Settings"
        res.render("pages/dashboard/settings", {
            tagline,
            user: req.session.user,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/password-change", isAuthorized([roles.cashierRole, roles.adminRole]), async (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Password Change"
        res.render("pages/dashboard/password-change", {
            tagline,
            user: req.session.user,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})

dashboardPagesRouter.get("/login", (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        // const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        const tagline = "Login"
        res.render("pages/dashboard/login", {
            tagline,
            language
        }, (error, html) => {
            if (error) {
                console.log(error)
                res.status(500).json({ message: "A problem Occurred On server" })
            } else {
                res.send(html)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "A problem Occurred On server" })
    }
})
module.exports = dashboardPagesRouter