const sumCart = (req, res, next) => {
    const ArrProducts = req.cookies.CartPros
    var sumAllCart = 0
    if(ArrProducts) {
        ArrProducts.forEach((item) => {
            sumAllCart += item.SoLuong
        })
        req.sumAllCart = sumAllCart
    } else { 

        req.sumAllCart = 0
    }
    next()
}

module.exports = sumCart