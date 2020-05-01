const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const categoriesRouter = require('./Routers/Categories/categories.router')
const productRouter = require('./Routers/Products/product.router')
const userRouter = require('./Routers/users/user.router')
const bodyParser = require('body-parser')
const { getAllCate } = require('./Models/Categories/Cate.Modle')
const { getAllPro } = require('./Models/Products/Pro.Modle')
const cookieParser = require('cookie-parser')
const sumCart = require('./Midleware/SumCart')
const path = require('path')
const PORT = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))



app.use('/users',sumCart ,userRouter)
app.use('/categories' , sumCart ,categoriesRouter)
app.use('/products',sumCart ,productRouter)


var cateAllArr = []
const cateAll = async () => {
    const cateAll = await getAllCate()
    cateAll.forEach(cate => {
        cateAllArr.push(cate)
    });
}
cateAll()

app.engine('hbs', exphbs({ 
    extname: '.hbs',
    helpers: {
        listCate:  function() {
            return cateAllArr
        }
    }
}))
app.set('view engine', 'hbs')

app.get('/',sumCart ,async (req, res) => {

    const list = await getAllPro()
    res.render('vwProducts/ShowPro', {
        title: 'Home Page',
        list,
        isLogin: req.cookies.jwt !== undefined,
        sumCart: req.sumAllCart
    })
})

app.use((req, res) => {
    res.render('404')
})

app.listen(PORT, () => {
    console.log('Hello. Port is listening!!')
})