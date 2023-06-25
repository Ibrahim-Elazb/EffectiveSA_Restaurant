const { Router } = require("express")
const messageHandler = require("../../models/message");
const validation = require("../../middlewares/validation")
const { newMessageSchema, readMessageSchema, paginationSchema, idURLSchema } = require("./message.validationSchema");
const errorHandler = require("../../utils/errorHandler");
const { dateTimeFornmatter } = require("../../utils/dateFormatter");

const messageRouter = Router();

messageRouter.get("/", validation(paginationSchema), async (req, res, next) => {
    const pageNumber=req.query.page;
    try {
        const messages = await messageHandler.retreiveMessagesByPage(pageNumber)
        messages.forEach(item => {
            item.date = dateTimeFornmatter(item.date)
        })
        res.status(200).json({ messages })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

messageRouter.post("/new", validation(newMessageSchema), async (req, res, next) => {
    const { subject, name, email, phone, message } = req.body;
    try {
        const result = await messageHandler.storeMessage(subject, name, email, phone, message)
        if (result)
            res.status(201).json({ done: true })
        else
            throw new Error();
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

messageRouter.patch("/mark-read/:id", validation(idURLSchema), async (req, res, next) => {
    const id = req.params.id;
    try {
        const count = await messageHandler.markMessageAsReadOnlyOne(id)
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

messageRouter.patch("/mark-read", validation(readMessageSchema), async (req, res, next) => {
    const { messageIds } = req.body;
    try {
        const count = await messageHandler.markMessageAsRead(messageIds)
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

messageRouter.get("/all", async (req, res, next) => {
    try {
        const messages = await messageHandler.retreiveAllMessages()
        res.status(200).json({ messages })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

messageRouter.get("/unread", async (req, res, next) => {
    try {
        const messages = await messageHandler.retreiveUnreadMessages();
        res.json({ messages })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

messageRouter.get("/search", validation(newMessageSchema), async (req, res, next) => {
    const { subject, name, email, phone, message } = req.body;
    try {
        const messages = await messageHandler.filterMessages(subject, name, email, phone, message)
        res.json({ messages })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

module.exports = messageRouter;