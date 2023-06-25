const { retreiveAllMenuItems } = require("../../models/menu");
const { retreiveAllMenuTypes } = require("../../models/menu_type");

const PagesRouter = require("express").Router();

PagesRouter.get("/", (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        res.render("pages/Homepage", {
            tagline,
            language
        }, (error, html) => {
            if (error) {
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

PagesRouter.get("/homepage", (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        const tagline = language !== "ar" ? "Homepage" : "الصفحه الرئيسية"
        res.render("pages/Homepage", {
            tagline,
            language
        }, (error, html) => {
            if (error) {
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

PagesRouter.get("/Menu", async (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        const tagline = language !== "ar" ? "Menu" : "القائمة"
        const menuTypeList = await retreiveAllMenuTypes();
        const menuItemsList = await retreiveAllMenuItems();
        menuTypeList.forEach(element => {
            element.items = [];
            menuItemsList.forEach(item => {
                if (element.id === item.menu_type)
                    element.items.push(item)
            })
        });

        res.render("pages/menu", {
            tagline,
            language,
            menuTypeList
        }, (error, html) => {
            if (error) {
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

PagesRouter.get("/contact-us", (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        const tagline = language !== "ar" ? "Contact Us" : "تواصل معنا "
        res.render("pages/contact-us", {
            tagline,
            language
        }, (error, html) => {
            if (error) {
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

PagesRouter.get("/About-Us", (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        const tagline = language !== "ar" ? "About Us" : "معلومات عنا "
        res.render("pages/about-us", {
            tagline,
            language
        }, (error, html) => {
            if (error) {
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

PagesRouter.get("/Orders", (req, res, next) => {
    try {
        const language = req.cookies.language || "en";
        const tagline = language !== "ar" ? "Orders" : "الطلبات"
        res.render("pages/orders", {
            tagline,
            language
        }, (error, html) => {
            if (error) {
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


module.exports = PagesRouter