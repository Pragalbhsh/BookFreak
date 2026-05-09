const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMyChats } = require('../controllers/chatController');

router.get('/', authMiddleware, getMyChats);

module.exports = router;