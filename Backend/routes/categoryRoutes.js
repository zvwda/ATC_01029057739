const express = require('express');
const router = express.Router();
const { protect , adminOnly } = require('../middlewares/authMiddleware');
const { AddNewCategory, GetAllCat } = require('../controllers/categoryController');
const photoupload = require("../middlewares/photoUpload");

router.post('/', protect, adminOnly, photoupload.single("image"), AddNewCategory);
router.get('/', GetAllCat);

module.exports = router;
