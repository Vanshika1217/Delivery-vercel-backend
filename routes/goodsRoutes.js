const express = require('express');
const router = express.Router();
const goodsController = require('../Controllers/GoodsController');

router.post('/add', goodsController.addGoods);
router.get('/all', goodsController.fetchGoods);
router.put('/update/:id', goodsController.updateGoods);
// router.delete('/remove/:id', goodsController.removeGoods);

module.exports = router;
