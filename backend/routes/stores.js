const express = require('express');
const {
    getStores,
    getStore,
    createStore,
    updateStore,
    deleteStore
} = require('../controllers/stores');

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
const ratingRouter = require('./ratings');

const router = express.Router();

router.route('/')
    .get(getStores)
    .post(protect, authorize('admin', 'store_owner'), createStore);

router.route('/:id')
    .get(getStore)
    .put(protect, authorize('admin', 'store_owner'), updateStore)
    .delete(protect, authorize('admin', 'store_owner'), deleteStore);

// Mount the rating router
router.use('/:id/ratings', ratingRouter);

module.exports = router;