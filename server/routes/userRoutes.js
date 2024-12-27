const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/validationController')

router.post('/signup', userController.signup);
router.post('/login', authController.login);

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router.route("/:id").get(userController.getUserById).post(userController.deactivateUser).put(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
