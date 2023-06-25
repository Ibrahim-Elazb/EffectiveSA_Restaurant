const pool = require("../DB_connection")

async function storeMessage(subject, name, email, phone, message) {

    const sql = `INSERT INTO messages (subject, name, email, phone, message)
             VALUES ($1, $2, $3, $4, $5)`;
    try {
        const result = await pool.query(sql, [subject, name, email, phone, message])
        const rowCount = result.rowCount;
        if (rowCount > 0) {
            return true;
        } else {
            console.error('Error occured while inserting new message: \n');
            return false;
        }
    } catch (error) {
        console.error('Error inserting new message:', error);
        throw error;
    }
}

async function markMessageAsRead(messagesIdList) {
    const placeholders = messagesIdList.map((_, index) => `$${index + 1}`).join(', ');
    const sql = `UPDATE messages SET has_read = true WHERE id IN (${placeholders})`;

    try {
        const result = await pool.query(sql, messagesIdList);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error while updating messages:\n', error);
        throw error;
    }
}

async function markMessageAsReadOnlyOne(messageId) {
    const sql = `UPDATE messages SET has_read = true WHERE id=$1`;
    try {
        const result = await pool.query(sql, [messageId]);
        const rowCount = result.rowCount;
        return rowCount;
    } catch (error) {
        console.error('Error while updating messages:\n', error);
        throw error;
    }
}

async function retreiveMessagesByPage(pageNumber) {

    const sql = `SELECT *,
                (SELECT COUNT(*) FROM messages) AS total_count 
                FROM messages ORDER BY date DESC LIMIT 3 OFFSET $1`;
    try {
        const result = await pool.query(sql,[(pageNumber-1)*3]);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}

async function retreiveAllMessages() {

    const sql = `SELECT * FROM messages`;
    try {
        const result = await pool.query(sql);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}

async function retreiveUnreadMessages() {

    const sql = `SELECT * FROM messages WHERE has_read = false`;
    try {
        const result = await pool.query(sql);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}

async function filterMessages(subject, name, email, phone, message) {

    const sql = `SELECT * FROM messages WHERE name LIKE '%' || $1 || '%' AND 
                                            email LIKE '%' || $2 || '%' AND
                                            subject LIKE '%' || $3 || '%' AND
                                            phone LIKE '%' || $4 || '%' AND
                                            message LIKE '%' || $5 || '%'`;
    try {
        const result = await pool.query(sql, [subject, name, email, phone, message]);
        const rows = result.rows;
        return rows;
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}


module.exports = {
    storeMessage,
    markMessageAsRead,
    markMessageAsReadOnlyOne,
    retreiveAllMessages,
    retreiveMessagesByPage,
    retreiveUnreadMessages,
    filterMessages
}