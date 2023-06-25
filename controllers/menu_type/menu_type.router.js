const { addNewMenuType, retreiveAllMenuTypes, retreiveMenuType, updateMenuType, deleteMenuType } = require("../../models/menu_type");
const validation = require("../../middlewares/validation")
const { newMenuTypeSchema, editMenuTypeSchema, idURLSchema } = require("./menu_type.validationSchema");
const errorHandler=require("../../utils/errorHandler")

const menuTypeRouter = require("express").Router();

menuTypeRouter.get("/", async (req, res, next) => {
    try {
        const menu_types = await retreiveAllMenuTypes();
        res.status(200).json({ menu_types })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuTypeRouter.post("/new", validation(newMenuTypeSchema), async (req, res, next) => {
    try {
        const { name_en, name_ar } = req.body;
        const result = await addNewMenuType(name_en, name_ar);
        if (result)
            res.status(201).json({ done: true })
        else
            throw new Error();
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuTypeRouter.get("/all", async (req, res, next) => {
    try {
        const menu_types = await retreiveAllMenuTypes();
        res.status(200).json({ menu_types })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuTypeRouter.get("/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const menu_type = await retreiveMenuType(id);
        if (menu_type !== null)
            res.status(200).json(menu_type)
        else
            res.status(404).json({ error: "Menu Type Not Found" });
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuTypeRouter.patch("/edit/:id",validation(editMenuTypeSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name_en, name_ar } = req.body;
        const count = await updateMenuType(id, name_en, name_ar);
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuTypeRouter.delete("/delete/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const count = await deleteMenuType(id);
        res.status(201).json({ count })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

module.exports = menuTypeRouter;