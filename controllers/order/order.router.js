const orderRouter = require("express").Router();

const {
    addNewOrder, 
    retreiveOrderById, 
    retreiveOrderWithinPeriod, 
    updateOrderStatus
} = require("../../models/order");
const validation = require("../../middlewares/validation")
const { newOrderSchema, orderDateSchema, idURLSchema, orderStatusSchema, paginationSchema } = require("./order.validationSchema");
const errorHandler = require("../../utils/errorHandler");
const { retreiveOrdersByPage } = require("../../models/order");

orderRouter.post("/new", validation(newOrderSchema), async (req, res, next) => {
    try {
        const { client_name, client_email, client_phone, client_vehicle, notes, orderList } = req.body;
        const result = await addNewOrder(client_name, client_email, client_phone, client_vehicle, notes, orderList);
        if (result)
            res.status(201).json({ done: true })
        else
            throw new Error();
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

orderRouter.get("/all", validation(paginationSchema), async (req, res, next) => {
    try {
        let { page } = req.query;
        const orders = await retreiveOrdersByPage(page);
        res.status(200).json(orders)
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

orderRouter.get("/search_period",validation(orderDateSchema), async (req, res, next) => {
    try {
        let { start_date,end_date } = req.query;
        if (!end_date) 
            end_date=start_date+" 23:59:59";

        /*
        let { start_date_string,end_date_string } = req.query;
        const start_date = new Date(start_date_string);
        if (!end_date_string)
        const end_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate() + 1);
         */

        const orders = await retreiveOrderWithinPeriod(start_date, end_date);
        res.status(200).json(orders)
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

orderRouter.patch("/status/:id",validation(orderStatusSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const count = await updateOrderStatus(id, status);
        res.status(201).json({count})
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

orderRouter.get("/:id",validation(idURLSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await retreiveOrderById(id);
        if (order.length > 0) {
            const orderInfo = {
                id: order[0].id,
                client_name: order[0].client_name,
                client_email: order[0].client_email,
                client_phone: order[0].client_phone,
                client_vehicle: order[0].client_vehicle,
                notes: order[0].notes,
                order_time: order[0].order_time,
                total_price: order[0].total_price,
                status: order[0].status,
            }

            const orderItems = order.map(item => {
                return {
                    count: item.count,
                    price: item.price,
                    discount: item.discount,
                    menu_id: item.menu_id,
                    name_en: item.name_en,
                    name_ar: item.name_ar
                }
            })
            
            res.status(200).json({order:{...orderInfo,orderItems}})
        }
        else
            res.status(404).json({ error: "Order Not Found" });
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
})

module.exports = orderRouter;