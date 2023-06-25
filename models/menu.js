const pool = require("../DB_connection")

async function addNewMenuItem(name_en, name_ar, price, discount, menu_type, image) {

    const sql = `INSERT INTO menu (name_en,name_ar,price,discount,menu_type,image)
             VALUES ($1, $2, $3, $4, $5,$6)`;
    try {
        const result = await pool.query(sql, [name_en, name_ar, price, discount, menu_type, image])
        const rowCount = result.rowCount;
        if (rowCount > 0) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('Error occured while inserting new menu item: \n', error);
        throw error;
    }
}

async function retreiveAllMenuItems() {

    const sql = `SELECT menu.id, menu.name_en, menu.name_ar, menu.price, menu.discount, menu.menu_type,menu.image,
                menu_type.name_en as menu_type_en, menu_type.name_ar as menu_type_ar
                FROM menu
                INNER JOIN menu_type ON menu.menu_type = menu_type.id;
`;
    try {
        const result = await pool.query(sql);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}

async function retreiveMenuItemsByTypeId(typeId) {

    const sql = `SELECT * FROM menu WHERE menu_type= $1`;
    try {
        const result = await pool.query(sql, [typeId]);
        const rows = result.rows;
        return rows;

    } catch (error) {
        console.error('Error while selecting menu items:\n', error);
        throw error;
    }
}

async function retreiveMenuItemById(id) {

    const sql = `SELECT * FROM menu WHERE id= $1`;
    try {
        const result = await pool.query(sql, [id]);
        const rows = result.rows;
        if (rows.length > 0)
            return rows[0];
        else
            return null;
    } catch (error) {
        console.error('Error while selecting menu items:\n', error);
        throw error;
    }
}

async function updateMenuItem(id, name_en, name_ar, price, discount, menu_type, image) {

    let sql, rowCount, oldImage, result;
    try {
        if (image) {
            const updatedItem=await retreiveMenuItemById(id)
            oldImage = updatedItem?.image
            sql = `UPDATE menu
             SET name_en = $1, name_ar = $2, price = $3, discount = $4, menu_type = $5,image=$6
             WHERE id = $7`;
            result = await pool.query(sql, [name_en, name_ar, price, discount, menu_type, image, id]);
        } else {
            sql = `UPDATE menu
             SET name_en = $1, name_ar = $2, price = $3, discount = $4, menu_type = $5
             WHERE id = $6`;
            result = await pool.query(sql, [name_en, name_ar, price, discount, menu_type, id]);
        }
        rowCount = result.rowCount;
        return { rowCount, oldImage };
    } catch (error) {
        console.error('Error while updating menu item:\n', error);
        throw error;
    }
}

async function deleteMenuItem(id) {

    const sql = `DELETE FROM menu WHERE id = $1 RETURNING image`;
    try {
        const result = await pool.query(sql, [id]);
        const { rowCount, rows } = result;
        let image = "";
        if (rowCount > 0)
            image = rows[0].image;
        return { rowCount, image };
    } catch (error) {
        console.error('Error while deleting menu items:\n', error);
        throw error;
    }
}

module.exports = {
    addNewMenuItem,
    retreiveAllMenuItems,
    retreiveMenuItemsByTypeId,
    retreiveMenuItemById,
    updateMenuItem,
    deleteMenuItem
}