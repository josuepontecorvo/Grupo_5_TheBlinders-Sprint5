const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const multerMiddleware = require('../middleware/multer');
const userRegisterValidation = require('../middleware/userRegisterValidation');
const userEditValidation = require('../middleware/userEditValidation');
const userLoginValidation = require('../middleware/userLoginValidation');
const uploadFile = multerMiddleware('images/users',"user");


router.get('/', usersController.list);
router.get('/detalle/:id', usersController.detail);
router.get('/registro', usersController.register);
router.post('/registro', uploadFile.array('profileimg'), userRegisterValidation, usersController.store);
router.get('/ingresar', usersController.login);
router.post('/ingresar', userLoginValidation ,usersController.loginProcess);
router.get('/carrito', usersController.cart);
router.get('/editar/:id', usersController.edit);
router.put('/editar/:id',uploadFile.array('profileimg'),  userEditValidation ,usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;