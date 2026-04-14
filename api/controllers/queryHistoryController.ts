import { Request, Response } from 'express';
import pool from '../config/database';

// 模拟查询历史数据
let mockHistory = [
  {
    id: 1,
    userId: 1,
    drinkName: '可乐',
    energy: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 1,
    drinkName: '雪碧',
    energy: 40,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let nextHistoryId = 3;

const queryHistoryController = {
  async createQueryHistory(req: Request, res: Response) {
    try {
      const { userId, drinkName, energy } = req.body;
      
      const [result] = await pool.execute(
        'INSERT INTO query_history (user_id, drink_name, energy) VALUES (?, ?, ?)',
        [userId, drinkName, energy]
      );
      
      res.json({
        id: (result as any).insertId,
        userId,
        drinkName,
        energy,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('创建查询历史失败:', error);
      // 使用模拟数据
      const newHistory = {
        id: nextHistoryId++,
        ...req.body,
        createdAt: new Date().toISOString()
      };
      mockHistory.unshift(newHistory);
      res.json(newHistory);
    }
  },
  
  async getQueryHistoryByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const [rows] = await pool.execute(
        'SELECT id, drink_name as drinkName, energy, created_at as createdAt FROM query_history WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('获取查询历史失败:', error);
      // 使用模拟数据
      const { userId } = req.params;
      const userHistory = mockHistory.filter(h => h.userId === parseInt(userId));
      res.json(userHistory);
    }
  }
};

export default queryHistoryController;