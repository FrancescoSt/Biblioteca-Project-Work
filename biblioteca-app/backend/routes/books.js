const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookController');
const auth = require('../middleware/auth'); 

// Rotte GET pubbliche
router.get('/search', ctrl.searchBooks);
router.get('/', ctrl.getAllBooks);
router.get('/:id', ctrl.getBook);

// Rotte protette (richiedono il token JWT)
// La rotta POST ora supporta sia invio singolo che array grazie alla modifica nel controller
router.post('/', auth, ctrl.createBook);

router.patch('/add-pic', auth, ctrl.addDefaultPic);
router.patch('/pics', auth, ctrl.updateManyPics);
router.patch('/:id/pic', auth, ctrl.updateBookPic);
router.patch('/add-trama', auth, ctrl.addDefaultTrama);
router.patch('/trame', auth, ctrl.updateManyTrame);
router.patch('/:id/trama', auth, ctrl.updateBookTrama);
router.patch('/dettagli', auth, ctrl.updateManyDetails);
router.put('/:id', auth, ctrl.updateBook);
router.delete('/:id', auth, ctrl.deleteBook);

module.exports = router;