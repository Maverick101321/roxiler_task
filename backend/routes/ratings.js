const express = require('express');
const { addRating, getRatings } = require('../controllers/ratings');
const { protect, authorize } = require('../middleware/auth');

// This allows us to access params from the parent router (e.g., :id from the store router)
const router = express.Router({ mergeParams: true });

// A POST request to '/' on this router will correspond to POST /api/stores/:id/ratings
router.route('/')
    .get(getRatings)
    .post(protect, authorize('normal'), addRating);

module.exports = router;