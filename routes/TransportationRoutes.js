const express = require('express');
const router = express.Router();
const transportController = require('../Controllers/TransportationController');

router.post('/dispatch', transportController.dispatchDelivery);
router.put('/update/:id', transportController.updateDispatchStatus);
router.get('/log', transportController.fetchDispatches);
// router.get('/:id', transportController.getTransportById);

module.exports = router;
