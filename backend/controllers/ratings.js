const db = require('../config/db');

// @desc    Get all ratings for a specific store
// @route   GET /api/stores/:id/ratings
// @access  Public
exports.getRatings = async (req, res, next) => {
    try {
        const storeId = req.params.id;

        // We join with the Users table to include the reviewer's name in the response
        const [ratings] = await db.query(
            `SELECT r.id, r.rating, r.comment, r.created_at, u.name as userName
             FROM Ratings r
             JOIN Users u ON r.user_id = u.id
             WHERE r.store_id = ?`,
            [storeId]
        );

        res.status(200).json({ success: true, count: ratings.length, data: ratings });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add a rating to a store
// @route   POST /api/stores/:storeId/ratings
// @access  Private (Normal users only)
exports.addRating = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const storeId = req.params.id; // This comes from the store router
        const userId = req.user.id;

        // 1. Check if the store exists
        const [stores] = await db.query('SELECT id FROM Stores WHERE id = ?', [storeId]);
        if (stores.length === 0) {
            return res.status(404).json({ success: false, message: `Store not found with id of ${storeId}` });
        }

        // 2. Check if the user has already rated this store to provide a friendly error
        const [existingRatings] = await db.query(
            'SELECT id FROM Ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );

        if (existingRatings.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already rated this store' });
        }

        // 3. Insert the new rating
        const [result] = await db.query(
            'INSERT INTO Ratings (rating, comment, user_id, store_id) VALUES (?, ?, ?, ?)',
            [rating, comment, userId, storeId]
        );

        const [newRating] = await db.query('SELECT * FROM Ratings WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            data: newRating[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};