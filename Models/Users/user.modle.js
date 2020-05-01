const connection = require('../../db/connection')


const createUser = (user) => {
    const sql = `INSERT INTO taikhoan(tendangnhap, matkhau, email ) VALUES ('${user.UserName}', '${user.Pass}', '${user.Email}')`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

const findUserByEmail = (user) => {
    const sql = `SELECT * FROM taikhoan WHERE Email = '${user.Email}'`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

module.exports = {
    createUser,
    findUserByEmail
}