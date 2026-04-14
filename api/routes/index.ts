import express from 'express';
import waterFactoryController from '../controllers/waterFactoryController';
import productController from '../controllers/productController';
import energyController from '../controllers/energyController';
import reminderController from '../controllers/reminderController';
import queryHistoryController from '../controllers/queryHistoryController';
import userController from '../controllers/userController';

const router = express.Router();

// 水厂信息路由
router.get('/water-factory', waterFactoryController.getWaterFactory);

// 产品路由
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// 能量查询路由
router.get('/energy', energyController.getEnergy);

// 提醒路由
router.post('/reminders', reminderController.createReminder);
router.get('/reminders/:userId', reminderController.getRemindersByUserId);
router.put('/reminders/:id', reminderController.updateReminder);
router.delete('/reminders/:id', reminderController.deleteReminder);

// 查询历史路由
router.post('/query-history', queryHistoryController.createQueryHistory);
router.get('/query-history/:userId', queryHistoryController.getQueryHistoryByUserId);

// 用户路由
router.post('/users', userController.register);
router.post('/users/login', userController.login);

export default router;