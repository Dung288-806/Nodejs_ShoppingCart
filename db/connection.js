const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wintribefashion'
})

connection.connect((e, r) => {
    if(e) {
        return console.log(e + ' ')
    }
})

module.exports = connection

