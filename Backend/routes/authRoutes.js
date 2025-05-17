const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { register, login , UserInfo, deleteUser, getAllUsers} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/UserInfo', protect , UserInfo);
router.delete('/DeleteUser/:id',protect, adminOnly, deleteUser);
router.get("/AllUsers",protect,adminOnly, getAllUsers);

module.exports = router;