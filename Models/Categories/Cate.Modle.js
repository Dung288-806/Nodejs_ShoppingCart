const connection = require('../../db/connection')

const getAllCate = () => {
    const sql = `SELECT * FROM loaisanpham`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

module.exports = {
    getAllCate
}