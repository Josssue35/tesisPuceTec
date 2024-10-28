const express = require('express')
const router = express.Router()
const {
    getAllProducts,
} = require('../models/productoModel')


router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts()
        console.log('Productos respuesta:', products)
        res.json(products)
    }
    catch (error) {
        console.log('Error', error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router