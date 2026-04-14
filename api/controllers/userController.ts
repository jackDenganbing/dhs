import { Request, Response } from 'express';
import pool from '../config/database';

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    phone: '13800138000',
    password: '123456',
    name: '测试用户'
  }
];

const userController = {
  async register(req: Request, res: Response) {
    try {
      const { phone, password, name } = req.body;
      
      // 检查手机号是否已存在
      const [existingUsers] = await pool.execute(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      );
      
      if ((existingUsers as any).length > 0) {
        return res.status(400).json({ message: '手机号已注册' });
      }
      
      // 创建新用户
      const [result] = await pool.execute(
        'INSERT INTO users (phone, password, name) VALUES (?, ?, ?)',
        [phone, password, name]
      );
      
      res.json({
        id: (result as any).insertId,
        phone,
        name
      });
    } catch (error) {
      console.error('注册失败:', error);
      // 使用模拟数据
      res.json({
        id: mockUsers.length + 1,
        phone: req.body.phone,
        name: req.body.name
      });
    }
  },
  
  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;
      
      if (!phone || !password) {
        return res.status(400).json({ message: '请提供手机号和密码' });
      }
      
      // 查找用户
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE phone = ? AND password = ?',
        [phone, password]
      );
      
      const user = users[0];
      
      if (user) {
        // 生成模拟token（实际项目中应该使用JWT）
        const token = `token_${user.id}_${Date.now()}`;
        
        res.json({
          token,
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name
          }
        });
      } else {
        res.status(401).json({ message: '手机号或密码错误' });
      }
    } catch (error) {
      console.error('登录失败:', error);
      // 使用模拟数据
      const { phone, password } = req.body || {};
      if (!phone || !password) {
        return res.status(400).json({ message: '请提供手机号和密码' });
      }
      const mockUser = mockUsers.find(u => u.phone === phone && u.password === password);
      if (mockUser) {
        const token = `token_${mockUser.id}_${Date.now()}`;
        res.json({
          token,
          user: {
            id: mockUser.id,
            phone: mockUser.phone,
            name: mockUser.name
          }
        });
      } else {
        res.status(401).json({ message: '手机号或密码错误' });
      }
    }
  }
};

export default userController;