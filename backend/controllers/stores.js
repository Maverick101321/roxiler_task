const db = require('../config/db');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
exports.getStores = async (req, res, next) => {
    try {
        const query = `
            SELECT
                s.*,
                ROUND(AVG(r.rating), 1) as average_rating
            FROM Stores s
            LEFT JOIN Ratings r ON s.id = r.store_id
            GROUP BY s.id
        `;
        const [stores] = await db.query(query);
        res.status(200).json({ success: true, count: stores.length, data: stores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
exports.getStore = async (req, res, next) => {
    try {
        const query = `
            SELECT
                s.*,
                ROUND(AVG(r.rating), 1) as average_rating
            FROM Stores s
            LEFT JOIN Ratings r ON s.id = r.store_id
            WHERE s.id = ?
            GROUP BY s.id
        `;
        const [stores] = await db.query(query, [req.params.id]);
        if (stores.length === 0) {
            return res.status(404).json({ success: false, message: `Store not found with id of ${req.params.id}` });
        }
        res.status(200).json({ success: true, data: stores[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new store
// @route   POST /api/stores
// @access  Private (Admin, Store Owner)
exports.createStore = async (req, res, next) => {
    try {
        const { name, email, address } = req.body;
        // The owner_id is the ID of the logged-in user
        const owner_id = req.user.id;

        const [result] = await db.query(
            'INSERT INTO Stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );

        const [newStore] = await db.query('SELECT * FROM Stores WHERE id = ?', [result.insertId]);

        res.status(201).json({ success: true, data: newStore[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private (Admin, Store Owner of this store)
exports.updateStore = async (req, res, next) => {
    try {
        const [stores] = await db.query('SELECT * FROM Stores WHERE id = ?', [req.params.id]);
        let store = stores[0];

        if (!store) {
            return res.status(404).json({ success: false, message: `Store not found with id of ${req.params.id}` });
        }

        // Make sure user is the store owner or an admin
        if (store.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'User is not authorized to update this store' });
        }

        const { name, email, address } = req.body;
        await db.query(
            'UPDATE Stores SET name = ?, email = ?, address = ? WHERE id = ?',
            [name || store.name, email || store.email, address || store.address, req.params.id]
        );

        const [updatedStore] = await db.query('SELECT * FROM Stores WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, data: updatedStore[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private (Admin, Store Owner of this store)
exports.deleteStore = async (req, res, next) => {
    try {
        const [stores] = await db.query('SELECT owner_id FROM Stores WHERE id = ?', [req.params.id]);
        const store = stores[0];

        if (!store) {
            return res.status(404).json({ success: false, message: `Store not found with id of ${req.params.id}` });
        }

        // Make sure user is the store owner or an admin
        if (store.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'User is not authorized to delete this store' });
        }

        await db.query('DELETE FROM Stores WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};