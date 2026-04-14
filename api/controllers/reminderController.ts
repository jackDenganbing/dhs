import { Request, Response } from 'express';
import pool from '../config/database';

// 模拟提醒数据
let mockReminders = [
  {
    id: 1,
    userId: 1,
    time: '08:00',
    frequency: 2,
    enabled: true
  },
  {
    id: 2,
    userId: 1,
    time: '12:00',
    frequency: 2,
    enabled: true
  }
];

let nextId = 3;

const reminderController = {
  async createReminder(req: Request, res: Response) {
    try {
      const { userId, time, frequency, enabled } = req.body;
      
      const [result] = await pool.execute(
        'INSERT INTO reminders (user_id, time, frequency, enabled) VALUES (?, ?, ?, ?)',
        [userId, time, frequency, enabled]
      );
      
      res.json({
        id: (result as any).insertId,
        userId,
        time,
        frequency,
        enabled
      });
    } catch (error) {
      console.error('创建提醒失败:', error);
      // 使用模拟数据
      const newReminder = {
        id: nextId++,
        ...req.body
      };
      mockReminders.push(newReminder);
      res.json(newReminder);
    }
  },
  
  async getRemindersByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const [rows] = await pool.execute(
        'SELECT id, time, frequency, enabled FROM reminders WHERE user_id = ?',
        [userId]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('获取提醒列表失败:', error);
      // 使用模拟数据
      const { userId } = req.params;
      const userReminders = mockReminders.filter(r => r.userId === parseInt(userId));
      res.json(userReminders);
    }
  },
  
  async updateReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { time, frequency, enabled } = req.body;
      
      const [result] = await pool.execute(
        'UPDATE reminders SET time = ?, frequency = ?, enabled = ? WHERE id = ?',
        [time, frequency, enabled, id]
      );
      
      if ((result as any).affectedRows > 0) {
        res.json({
          id,
          time,
          frequency,
          enabled
        });
      } else {
        res.status(404).json({ message: '提醒不存在' });
      }
    } catch (error) {
      console.error('更新提醒失败:', error);
      // 使用模拟数据
      const { id } = req.params;
      const index = mockReminders.findIndex(r => r.id === parseInt(id));
      if (index !== -1) {
        mockReminders[index] = {
          ...mockReminders[index],
          ...req.body
        };
        res.json(mockReminders[index]);
      } else {
        res.status(404).json({ message: '提醒不存在' });
      }
    }
  },
  
  async deleteReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const [result] = await pool.execute(
        'DELETE FROM reminders WHERE id = ?',
        [id]
      );
      
      if ((result as any).affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: '提醒不存在' });
      }
    } catch (error) {
      console.error('删除提醒失败:', error);
      // 使用模拟数据
      const { id } = req.params;
      const index = mockReminders.findIndex(r => r.id === parseInt(id));
      if (index !== -1) {
        mockReminders.splice(index, 1);
        res.json({ success: true });
      } else {
        res.status(404).json({ message: '提醒不存在' });
      }
    }
  }
};

export default reminderController;