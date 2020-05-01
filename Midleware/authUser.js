const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    console.log(req.cookies.jwt)
    try {
        if(!req.cookies.jwt) {
            console.log('Không có ck jwt ')
            return res.redirect('/')
        }
        const clientToken = req.cookies.jwt
    
        const decoded = jwt.verify(clientToken, 'dungdeptrai')
    
        req.user = decoded
        next()
    } catch (e) {
        console.log(e + ' ')
         res.redirect('/')
    }
}
module.exports = {
    auth
}