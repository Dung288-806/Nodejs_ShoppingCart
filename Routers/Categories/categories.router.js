const express = require('express')
const { getAllCate } = require('../../Models/Categories/Cate.Modle')
const router = new express.Router

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page'
    })
})

router.get('/show', async (req, res) => {
    const list = await getAllCate()
    res.render('vwCategories/ShowCate', {
        list,
        isShow: list.length === 0
    })
})

module.exports = router