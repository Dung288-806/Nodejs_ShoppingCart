const connection = require('../../db/connection')

const getAllPro = () => {
    const sql = 'SELECT * FROM sanpham'
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}
const createPro = (pro) => {
    const sql = `INSERT INTO sanpham(tensanpham, giasanpham, soluongton, maloaisanpham, mahangsanxuat) VALUES ('${pro.namePro}', ${pro.price}, ${pro.quantity}, ${1}, ${1})`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

const findProByID = (id) => {
    const sql = `SELECT * FROM sanpham WHERE masanpham = ${id}`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

const findProByCateID = (cateID) => {
    const sql = `SELECT * FROM sanpham WHERE maloaisanpham = ${cateID}`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

const updateProByID = (pro) => {
    const sql = `UPDATE sanpham SET tensanpham = '${pro.namePro}', giasanpham = ${pro.price}, soluongton = ${pro.quantity} WHERE masanpham = ${pro.proID}`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

const deleteProByID = (id) => {
    const sql = `DELETE FROM sanpham WHERE masanpham = ${id}`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject(e)
            resole(r)
        })
    })
}

module.exports = {
    getAllPro,
    deleteProByID,
    createPro,
    updateProByID,
    findProByID,
    findProByCateID
}