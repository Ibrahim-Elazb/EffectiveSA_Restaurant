const format = require('pg-format');
const pool = require("../DB_connection");
const { retreiveMenuItemById } = require("./menu");

async function addNewOrder(client_name, client_email, client_phone,client_vehicle, notes, orderList) {

    // Start a transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const detailedOrderList = await Promise.all(orderList.map(async (item) => {
            const element = await retreiveMenuItemById(item.id);
            return { ...item, ...element }
        }))


        const total_price = detailedOrderList.reduce((acc, item) => acc + (item.price - item.price * item.discount) * item.count, 0)

        // Insert the order data into the "orders" table
        const orderInsertQuery = `INSERT INTO orders (client_name, client_email, client_phone, client_vehicle, notes, order_time, total_price,status)
                               VALUES ($1, $2, $3, $4, $5, $6 ,$7, $8)
                               RETURNING id`;
        const orderInsertValues = [
            client_name,
            client_email,
            client_phone,
            client_vehicle,
            notes,
            new Date().toISOString().replace(/\.\d+Z$/, ''),
            total_price,
            "pending"
        ];
        const orderInsertResult = await client.query(orderInsertQuery, orderInsertValues);

        // Get the inserted order ID
        const orderId = orderInsertResult.rows[0].id;
        const orderDetailsValues = detailedOrderList.map((item) => [item.count, item.price, item.discount * item.count, orderId, item.id]);
        // Insert the order details data into the "order_details" table
        const orderDetailsInsertQuery = format(`INSERT INTO order_details (count, price,discount, order_id, menu_id)
                                     VALUES %L`, orderDetailsValues);

        await client.query(orderDetailsInsertQuery);

        // Commit the transaction
        await client.query('COMMIT');
        return true;
    } catch (error) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        console.error('Error adding order:', error);
        return false;
    }
}

async function retreiveOrderById(id) {

    try {
        const selectQuery = `
      SELECT o.id, o.client_name, o.client_email, o.client_phone,o.client_vehicle, o.notes, o.order_time, o.total_price,o.status,
             od.id AS order_detail_id, od.count, od.price, od.discount,od.menu_id,m.name_en,m.name_ar
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      JOIN menu m ON od.menu_id = m.id
      WHERE o.id = $1
    `;

        const result = await pool.query(selectQuery, [id]);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting orders:', error);
        throw error;
    }
}

async function retreiveOrdersByPage(pageNumber) {

    try {
        const selectQuery = `
      SELECT id, client_name, order_time, total_price,status,
                (SELECT COUNT(*) FROM orders) AS total_count 
      FROM orders ORDER BY order_time DESC LIMIT 3 OFFSET $1
    `;

        const result = await pool.query(selectQuery, [(pageNumber - 1) * 3]);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting orders:', error);
        throw error;
    }
}

async function retreiveOrderWithinPeriod(startDate, endDate) {

    try {
        const selectQuery = `
      SELECT o.id, o.client_name, o.client_email, o.client_phone, o.notes, o.order_time, o.total_price,
             od.id AS order_detail_id, od.count, od.price
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      WHERE o.order_time BETWEEN $1 AND $2
    `;
        /* WHERE order_time >= $1 AND order_time < $2 or order_time BETWEEN $1 AND $2*/

        const result = await pool.query(selectQuery, [startDate, endDate]);

        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting orders:', error);
        throw error;
    }
}

async function updateOrderStatus(id, status) {

    const sql = `UPDATE orders
             SET status = $1
             WHERE id = $2`;
    try {
        const result = await pool.query(sql, [status, id]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}


module.exports = {
    addNewOrder,
    retreiveOrderById,
    retreiveOrdersByPage,
    retreiveOrderWithinPeriod,
    updateOrderStatus
}