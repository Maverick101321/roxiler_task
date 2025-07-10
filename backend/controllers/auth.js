const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password, address, role } = req.body;

    try {
        // Basic validation
        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT email FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        const [result] = await db.query(
            'INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );

        const userId = result.insertId;

        // Create token
        const token = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({
            success: true,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({
            success: true,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    // req.user is set by the protect middleware
    res.status(200).json({ success: true, data: req.user });
};