const path=require("path")
const menuRouter = require("express").Router();
const errorHandler = require("../../utils/errorHandler");

const {
    addNewMenuItem,
    retreiveAllMenuItems,
    retreiveMenuItemsByTypeId,
    retreiveMenuItemById,
    updateMenuItem,
    deleteMenuItem
} = require("../../models/menu");
const validation =require("../../middlewares/validation")
const { newMenuSchema, editMenuSchema,idURLSchema } = require("./menu.validationSchema");
const upload = require("../../services/multer_file-upload");
const deleteFile = require("../../utils/deleteFile");
const rootPath = require("../../utils/rootPath");


const imageFileType = [".jpg", ".jpeg", ".png", ".webp"]
const uploadImage = upload(path.join(rootPath, "public", "images", "menu"), imageFileType).single("image")

menuRouter.get("/", async (req, res, next) => {
    try {
        const menu = await retreiveAllMenuItems();
        res.status(200).json({ menu })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message||'error occurred on server',next)
    }
})

menuRouter.post("/new", uploadImage , validation(newMenuSchema), async (req, res, next) => {
    try {
        const { name_en, name_ar, price, discount, menu_type } = req.body;
        const image = req.file?.filename;

        const result = await addNewMenuItem(name_en, name_ar, price, discount, menu_type, image);
        if (result)
            res.status(201).json({ done: true })
        else
            throw new Error();
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuRouter.get("/all", async (req, res, next) => {
    try {
        const menu = await retreiveAllMenuItems();
        res.status(200).json({ menu })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuRouter.get("/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const menu = await retreiveMenuItemById(id);
        if (menu !== null)
            res.status(200).json(menu)
        else
            res.status(404).json({ error: "Menu Item Not Found" });
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuRouter.get("/type/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const menu = await retreiveMenuItemsByTypeId(id);
        res.status(200).json({ menu })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuRouter.patch("/edit/:id", uploadImage,validation(editMenuSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name_en, name_ar, price, discount, menu_type } = req.body;
        const image=req.file?.filename
        const { rowCount, oldImage } = await updateMenuItem(id, name_en, name_ar, price, discount, menu_type, image);
        if(oldImage)
            deleteFile(path.join(rootPath,"public","images","menu",oldImage))
        res.status(201).json({ rowCount })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

menuRouter.delete("/delete/:id", validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const {rowCount,image} = await deleteMenuItem(id);
        deleteFile(path.join(rootPath, "public", "images", "menu", image))
        res.status(201).json({ rowCount })
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

module.exports = menuRouter;