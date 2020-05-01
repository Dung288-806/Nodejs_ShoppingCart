const express = require('express')
const path = require('path')
const sumCart = require('../../Midleware/SumCart')
const { getAllPro, deleteProByID, updateProByID, findProByID, findProByCateID } = require('../../Models/Products/Pro.Modle')
const sendEmail = require('@sendgrid/mail')
const { findUserByEmail } = require('../../Models/Users/user.modle')
const { addBill, addDetailBill } = require('../../Models/Bill/Bill.Modle')
const moment = require('moment')

const router = new express.Router
const pathPublicFolder = path.join(__dirname, '../../public'); 

router.use(express.static(pathPublicFolder));

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        sumCart: req.sumAllCart
    })
})

router.post('/show/:id', async (req, res) => {   
    const cateID = req.params.id
    const listOld = await findProByCateID(cateID)
    const page = req.query.page || 1
    const perPage = 6  // số sản phẩm trong 1 page
    const start = (page - 1) * perPage
    const end = page * perPage
    list = listOld.slice(start, end)

    res.render('vwProducts/ShowPro', {
        title: 'Home Page',
        list,
        isList: list.length === 0,
        cateID,
        isLogin: req.cookies.jwt !== undefined,
        sumCart: req.sumAllCart,
        layout: false
    }, (e, html) => {
        res.json({
            html
        })
    })
})

router.get('/show' ,async (req, res) => {
    
    const list = await getAllPro()
    res.render('vwProducts/ShowPro', {
        list,
        isShow: list.length === 0,
        isLogin: req.cookies.jwt !== undefined,
        sumCart: req.sumAllCart
    })
})

router.get('/detail/:id', async (req, res) => {

    const product = await findProByID(req.params.id)
    res.render('vwProducts/ViewDetail', {
        product: product[0],
        isLogin: req.cookies.jwt !== undefined,
        sumCart: req.sumAllCart
    })
})

router.post('/add/cart/:id', async (req, res) => {
    const IDPro = req.params.id
    try {
        const product = await findProByID(IDPro)
        if(!product) {
            throw new Error('Not found a the products with ID = ' + IDPro )
        }
        // res.cookie("products", arr);  // tạo cookies để lưu sản phẩm
        // LOGIC Dùng session-cookie để lưu vô giỏ hàng
        /*
            kiểm tra xem giỏ hnagf đã tồn tại chưa ?
            nếu có rồi:
                Kiểm tra xem mặt hàng đó đã mua chưa? Nếu chưa 
                    Nếu chưa: Thêm vào giỏ: id+ sl = 1
                    nếu rồi thì chỉ cần update số luọng += 1
            nếu chưa có thì tạo giỏ hàng và đưa vào với sl = 1
        */
        var isCheck = false
        const ArrProducts = req.cookies.CartPros  // lấy ra mảng các sm trong giỏ
        if(ArrProducts) { // nếu có
            ArrProducts.forEach(pro => {
                if(pro.MaSanPham === IDPro) {
                    isCheck = true
                    pro.SoLuong += 1
                }
            });
            if(isCheck) {
                res.cookie('CartPros', ArrProducts)
            } else {
                ArrProducts.push({
                    MaSanPham: IDPro,
                    SoLuong: 1
                })
                res.cookie('CartPros', ArrProducts)
            }
        } else {
            const ArrProducts = []
            const carts = {
                MaSanPham: IDPro,
                SoLuong: 1
            }
            ArrProducts.push(carts)
            res.cookie('CartPros', ArrProducts)
        }

    } catch (e) {
        console.log(e + ' ')
    }
    const ArrProducts = req.cookies.CartPros
    var sumCart = 0
    if(ArrProducts) {
        ArrProducts.forEach((item) => {
            sumCart += item.SoLuong
        })
    }
    res.render('partials/header', {
        layout:  false,
        isLogin: req.cookies.jwt !== undefined,
        sumCart
    }, (e, html) => {
        res.send(html)
    })
})

const getProductsBought = async (req, res, next) => {

    var arrProductsBought = []
    const ArrProducts = req.cookies.CartPros
    var dem = 1
    var sumMoney = 0
    if(ArrProducts) {
        ArrProducts.forEach( async function(item) {
            var product = await findProByID(item.MaSanPham)
            product[0].SoLuong = (item.SoLuong)
            sumMoney += product[0].SoLuong * product[0].GiaSanPham
            arrProductsBought.push(product[0])
            if(dem === ArrProducts.length){
                req.pro = arrProductsBought
                req.sumMoney = sumMoney
                next()
            }
            dem++
        })
    } else {
        req.pro = 0
        next()
    }
}

router.get('/cart', getProductsBought, (req, res) => {

    res.render('vwProducts/Cart', {
        sumCart: req.sumAllCart,
        arrProductsBought : req.pro,
        sumMoney: req.sumMoney,
        isArrProducts: req.sumAllCart == 0,
        isLogin: req.cookies.jwt !== undefined
    })
})

const deleteProBought = (req, res, next) => {

    const idPro = req.params.id
    var ArrProducts = req.cookies.CartPros
    if(ArrProducts) {

        for(i = 0; i < ArrProducts.length; i++) {
            if(ArrProducts[i].MaSanPham === idPro) {
                ArrProducts.splice(i, 1)
            }
        }
        if(ArrProducts.length == 0) {
            res.clearCookie('CartPros')
            next()
        }
        else {
            res.cookie('CartPros', ArrProducts)
        }
        next()
    } else {
        res.redirect('/')
    }
    
}

router.get('/cart/delete/:id', deleteProBought ,getProductsBought, (req, res) => {
    var ArrProducts = req.cookies.CartPros
    var sumAllCart = 0
    if(ArrProducts.length !== 0) {
        ArrProducts.forEach((item) => {
            sumAllCart += item.SoLuong
        })
    } else { 
        sumAllCart = 0
    }
    res.render('vwProducts/Cart', {
        sumCart: sumAllCart,
        arrProductsBought : req.pro,
        sumMoney: req.sumMoney,
        isArrProducts: sumAllCart == 0,
        isLogin: req.cookies.jwt !== undefined
    })
})

const updateNumCart = (req, res, next) => {
    const maSP = (req.query.maSP)
    const sl = parseInt(req.query.sl)
    var ArrProducts = req.cookies.CartPros
    if(ArrProducts) {
        
        for(i = 0; i < ArrProducts.length; i++) {
            if(ArrProducts[i].MaSanPham === maSP) {
                ArrProducts[i].SoLuong = sl
            }
        }
        console.log(ArrProducts)
        res.cookie('CartPros', ArrProducts)
        next()
    } else {
        res.redirect('/')
    }
}

router.get('/cart/update', updateNumCart ,getProductsBought ,(req, res) => {

    var ArrProducts = req.cookies.CartPros
    var sumAllCart = 0
    if(ArrProducts.length !== 0) {
        ArrProducts.forEach((item) => {
            sumAllCart += item.SoLuong
        })
    } else { 
        sumAllCart = 0
    }
    res.render('vwProducts/Cart', {
        sumCart: sumAllCart,
        arrProductsBought : req.pro,
        sumMoney: req.sumMoney,
        isArrProducts: sumAllCart == 0,
        isLogin: req.cookies.jwt !== undefined
    })

})

router.get('/pay', getProductsBought ,async (req, res) => {
    // lưu vào db

    const idDonDatHang = Math.floor(Math.random() * (123654789 - 1 + 1) ) + 1;
    const emailUser = {
        Email: req.cookies.user
    }
    try {
        const user = await findUserByEmail(emailUser)
        const bill = {
            MaDon: idDonDatHang,
            NgayLap: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            TongTien: req.sumMoney,
            MaTaiKhoan: user[0].MaTaiKhoan
        }
        await addBill(bill)
        const arrProductsBought = req.pro
        arrProductsBought.forEach( async (item) => {
            
            const idChiTietDonDatHang = Math.floor(Math.random() * (12365478912 - 1 + 1) ) + 1;
            const detailBill = {
                MaChiTiet: idChiTietDonDatHang,
                SoLuong: item.SoLuong,
                GiaBan: item.GiaSanPham,
                MaSanPham: item.MaSanPham,
                MaDonHang: idDonDatHang
            }
            await addDetailBill(detailBill)
        })
    } catch (e) {
        throw new Error(e)
    }

    // send Mail tới user
    res.clearCookie('CartPros') // Khi thanh toán thì xóa giở hàng
    var text = ''
    req.pro.forEach((item) => {
        text += `Tên Sản Phẩm: ${item.TenSanPham} - Gía mua: ${item.GiaSanPham} \n`
    })
    const emalAPIKey = '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'
    sendEmail.setApiKey(emalAPIKey)
    try {
        sendEmail.send({
            from: 'daoadung@gmail.com',
            to: req.cookies.user,
            subject: 'Thanh toán hóa đơn',
            text: text + `Tổng tiền là ${req.sumMoney}`
        })
        res.render('vwProducts/pay', {
            sumMoney: req.sumMoney
        })
    } catch (e) {
        console.log(e + ' ')
    }
})

router.get('/update/:id', async (req, res) => {
    try {
        const product =  await findProByID(req.params.id)
        if(product.length === 0) {
            res.render('404')
        } else {
            res.render('vwProducts/UpdatePro', {
                product: product[0]
            })
        }
    } catch (e) {
        console.log(e + ' ')
    }
})
router.post('/update', async (req, res) => {
    try {
        const product =  req.body
        await updateProByID(product)
        res.redirect('/')
    } catch (e) {
        console.log(e + ' ')
    }
})

router.get('/delete/:id', async (req, res) => {
    try {
        await deleteProByID(req.params.id)
    } catch (e) {
        console.log(e + ' ')
    }
    res.redirect('/products/show')
})

module.exports = router