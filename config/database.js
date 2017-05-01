// config/database.js
module.exports = {
    'url' : process.env.NODE_ENV === 'test' ? process.env.DB_HOST_TEST : process.env.DB_HOST
};