const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER_NAME,
    host: process.env.DB_HOST_NAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number.parseInt(process.env.DB_PORT) || 5432,
})


// Handle termination signals
process.on('SIGINT', () => {
    cleanup();
});

process.on('SIGTERM', () => {
    cleanup();
});

// Cleanup function to release the pool connections
function cleanup() {
    pool.end()
        .then(() => {
            console.log('Connection pool closed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error closing connection pool:', error);
            process.exit(1);
        });
}


module.exports = pool;