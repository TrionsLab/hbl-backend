const express = require('express');
const router = express.Router();

const { getReferences, addReferences, deleteReference, updateReference } = require('../controllers/referenceController');

router.get('/', getReferences);
router.post('/add-ref', addReferences);
router.delete('/delete-ref:id', deleteReference);
router.put('/update-ref:id', updateReference);



module.exports = router;
