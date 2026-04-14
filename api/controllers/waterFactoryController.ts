import { Request, Response } from 'express';
import pool from '../config/database';

// 模拟水厂数据
const mockFactory = {
  id: 1,
  name: '清泉水厂',
  description: '清泉水厂成立于1998年，位于风景秀丽的山区，采用天然山泉水，经过多重过滤和消毒处理，为消费者提供优质的饮用水。',
  history: '1998年建厂，2000年通过ISO9001质量认证，2005年获得国家免检产品称号，2010年扩建生产线，2015年推出高端矿泉水系列。',
  honors: ['国家免检产品', '中国驰名商标', '消费者信得过产品', '绿色食品认证']
};

const waterFactoryController = {
  async getWaterFactory(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute('SELECT * FROM water_factory LIMIT 1');
      const factory = rows[0];
      
      if (factory) {
        // 处理honors字段，将字符串转换为数组
        if (factory.honors) {
          factory.honors = factory.honors.split('、');
        }
        res.json(factory);
      } else {
        res.json(mockFactory);
      }
    } catch (error) {
      console.error('获取水厂信息失败:', error);
      // 使用模拟数据
      res.json(mockFactory);
    }
  }
};

export default waterFactoryController;