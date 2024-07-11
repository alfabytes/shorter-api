const express = require('express');
const router = express.Router();

const { createLink, getAllLinks } = require('../controllers/linkControllers');

router.get('/:username', getAllLinks);
router.post('/', createLink);

module.exports = router;