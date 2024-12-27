const express = require('express');
const router = express.Router();
const authController = require('../controller/validationController')

const viewController = require('../controller/viewController')

// public
router.get('/', viewController.getHome)
router.get('/reopened', viewController.getReopened)
router.get('/contact', viewController.getContact)
router.get('/currentresults', viewController.getCurrentResults)
router.get('/faq', viewController.getFaq)
router.get('/results', viewController.getResults)
router.get('/login', viewController.getLoginForm)

// users
router.get('/vote', authController.protect, authController.restrictTo('user'), viewController.getVote)

router.get('/admincrud', authController.protect, authController.restrictTo('admin'), viewController.getAdminCrud);
router.get('/admin', authController.protect, authController.restrictTo('admin'), viewController.getAdmin);
router.get('/dashboard', authController.protect, authController.restrictTo('admin'), viewController.getDashboard);
router.get('/reopentopic', authController.protect, authController.restrictTo('admin'), viewController.getReopenTopic);
router.get('/adminresult', authController.protect, authController.restrictTo('admin'), viewController.getCurrentTopic);





module.exports = router;
