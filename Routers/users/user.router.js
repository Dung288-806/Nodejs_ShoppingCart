const express = require('express')
const bodyParser = require('body-parser')
const { createUser, findUserByEmail } = require('../../Models/Users/user.modle')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { auth } = require('../../Midleware/authUser')
const cookieParser = require('cookie-parser')

const router = new express.Router
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(cookieParser())


const generateAuthToken = async function(user){  // không được arrow function
    try { 
        const token = jwt.sign({ _email: user.Email }, 'dungdeptrai')
        return token
    } catch (e) {
        throw new Error(e)
    }  
}

router.post('/create', async (req, res) => {
    try {
        let user = req.body
        user.Pass = await bcryptjs.hash(user.Pass, 8)
        await createUser(req.body)
        const clientToken = await generateAuthToken(user)
        res.cookie('jwt', clientToken)
        res.cookie('user', user.Email)
        res.redirect('/')
    } catch (error) {
        console.log(error + ' ')
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await findUserByEmail(req.body) // có user
        if(user.length === 0) {
            console.log('ko co acc')
            return res.render('404', {
                isError: true
            })
        }
        else {
            const isMatch = await bcryptjs.compare(req.body.Pass, user[0].MatKhau)
            if(!isMatch) {
                console.log('Sai pass')
                return res.render('404', {
                    isError: true
                })
            }
            console.log('co acc')
            const clientToken = await generateAuthToken(user[0])
            res.cookie('jwt', clientToken)
            res.cookie('user', user[0].Email)
            res.redirect('/')
        }
    } catch (e) {
        console.log(e + ' ')
    }
})


router.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
})

router.get('/profile', auth, (req, res) => {
    res.json({
        user: req.user
    }) 
})

module.exports = router