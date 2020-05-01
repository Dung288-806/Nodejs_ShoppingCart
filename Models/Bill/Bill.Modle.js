const connection = require('../../db/connection')

const addBill = (bill) => {
    const sql = `INSERT INTO dondathang (MaDonDatHang, NgayLap, TongThanhTien, MaTaiKhoan, MaTinhTrang) VALUES ('${bill.MaDon}', '${bill.NgayLap}', '${bill.TongTien}', ${bill.MaTaiKhoan}, 1)`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject('Lỗi addBill' + e)
            resole(r)
        })
    })
}

const addDetailBill = (detailBill) => {
    const sql = `INSERT INTO chitietdondathang (MaChiTietDonDatHang, SoLuong, GiaBan, MaDonDatHang, MaSanPham) VALUES ('${detailBill.MaChiTiet}', '${detailBill.SoLuong}', ${detailBill.GiaBan}, '${detailBill.MaDonHang}', '${detailBill.MaSanPham}')`
    return new Promise((resole, reject) => {
        connection.query(sql, (e, r, f) => {
            if(e) reject('Lỗi addDetailBill' + e)
            resole(r)
        })
    })
}

module.exports = {
    addBill,
    addDetailBill
}