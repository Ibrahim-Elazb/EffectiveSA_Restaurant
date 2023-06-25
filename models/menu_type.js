const pool = require("../DB_connection")

async function addNewMenuType(name_en, name_ar) {

    const sql = `INSERT INTO menu_type (name_en,name_ar)
             VALUES ($1, $2)`;
    try {
        const result = await pool.query(sql, [name_en, name_ar])
        const rowCount = result.rowCount;

        if (rowCount > 0) {
            return true;
        } else{
            console.error('Error occured while inserting new menu type: \n');
            return false;
        }
    } catch (error) {
        console.error('Error occured while inserting new menu type: \n', error);
        throw error;
    }
}

async function retreiveAllMenuTypes() {

    const sql = `SELECT * FROM menu_type`;
    try {
        const result = await pool.query(sql);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting Menu Types:', error);
        throw error;
    }
}

async function retreiveMenuType(id) {

    const sql = `SELECT * FROM menu_type WHERE id= $1`;
    try {
        const result = await pool.query(sql, [id]);
        const rows = result.rows;
        if(rows.length>0)
            return rows[0];
        else
            return null;
    } catch (error) {
        console.error('Error selecting Menu Types:', error);
        throw error;
    }
}

async function updateMenuType(id, name_en, name_ar) {

    const sql = `UPDATE menu_type
             SET name_en = $1, name_ar = $2
             WHERE id = $3`;
    try {
        const result = await pool.query(sql, [name_en, name_ar, id]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error while updating menu items:\n', error);
        throw error;
    }
}

async function deleteMenuType(id) {

    const sql = `DELETE FROM menu_type WHERE id = $1`;
    try {
        const result = await pool.query(sql, [id]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error while deleting menu items:\n', error);
        throw error;
    }
}

module.exports = {
    addNewMenuType,
    retreiveAllMenuTypes,
    retreiveMenuType,
    updateMenuType,
    deleteMenuType
}