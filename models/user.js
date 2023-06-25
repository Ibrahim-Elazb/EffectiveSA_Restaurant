const bcrypt = require("bcrypt")
const pool = require("../DB_connection");

const HTTPError = require("../utils/HTTPError");
const errorHandler = require("../utils/errorHandler");

async function addNewUser(name, password, email, phone, start_working_day, notes = "", role) {

    const sql = `INSERT INTO users (name,password,email,phone,start_working_day,notes,role)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    try {
        const result = await pool.query(sql, [name, password, email, phone, start_working_day, notes, role])
        const rowCount = result.rowCount;
        if (rowCount > 0) {
            return true;
        } else {
            console.error('Error occured while inserting new user: \n');
            return false;
        }
    } catch (error) {
        console.error('Error inserting new user:', error);
        throw error;
    }
}

async function retreiveAllUsers() {

    const sql = `SELECT * FROM users`;
    try {
        const result = await pool.query(sql);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting users:', error);
        throw error;
    }
}

async function retreiveuserById(id) {

    const sql = `SELECT * FROM users WHERE id= $1`;
    try {
        const result = await pool.query(sql, [id]);
        const rows = result.rows;
        if (rows.length > 0)
            return rows[0];
        else
            return null;
    } catch (error) {
        console.error('Error selecting users:', error);
        throw error;
    }
}

async function retreiveByEmail(email) {

    const sql = `SELECT * FROM users WHERE email= $1`;
    try {
        const result = await pool.query(sql, [email]);
        const rows = result.rows;
        if (rows.length > 0)
            return rows[0];
        else
            return null;
    } catch (error) {
        console.error('Error selecting users:', error);
        throw error;
    }
}

async function searchForUser(name, email, start_working_day, notes, role) {

    const sql = `SELECT * FROM users WHERE name LIKE '%' || $1 || '%' AND 
                                            email LIKE '%' || $2 || '%' AND
                                            start_working_day LIKE '%' || $3 || '%' AND
                                            notes LIKE '%' || $4 || '%' AND
                                            role LIKE '%' || $5 || '%'`;
    try {
        const result = await pool.query(sql, [name, email, start_working_day, notes, role]);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting users:', error);
        throw error;
    }
}

async function updateUserSettings(id, name, email, phone) {

    const sql = `UPDATE users
             SET name = $1, email = $2, phone=$3
             WHERE id = $4`;
    try {
        const result = await pool.query(sql, [name, email, phone, id]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
}

async function updateUserInfo(id, name, email, phone, start_working_day, role, notes) {

    const sql = `UPDATE users
             SET name = $1, email = $2, phone=$3, start_working_day = $4, role = $5, notes = $6
             WHERE id = $7`;
    try {
        const result = await pool.query(sql, [name, email, phone, start_working_day, role, notes, id]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
}

async function updateUserpassword(id, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, +process.env.HASH_SALT)
        const sql = `UPDATE users
        SET password = $1
        WHERE id = $2`;
        const result = await pool.query(sql, [hashedPassword, id]);
        if (result.rowCount > 0) return true;
        else return false
    } catch (error) {
        console.log(error);
        errorHandler(error.statusCode || 500, error.message || 'error occurred on server', next)
    }
}

async function deleteUserById(id) {

    const sql = `DELETE FROM users WHERE id = $1`;
    try {
        const result = await pool.query(sql, [id]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error while deleing the user:', error);
        throw error;
    }
}

module.exports = {
    addNewUser,
    retreiveAllUsers,
    retreiveuserById,
    searchForUser,
    updateUserInfo,
    updateUserSettings,
    updateUserpassword,
    deleteUserById,
    retreiveByEmail
}