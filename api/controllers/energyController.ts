import { Request, Response } from 'express';

// 模拟饮料能量数据
const energyData = {
  '可乐': 42,
  '雪碧': 40,
  '芬达': 43,
  '冰红茶': 37,
  '绿茶': 16,
  '脉动': 27,
  '红牛': 112,
  '矿泉水': 0,
  '纯净水': 0,
  '碱性水': 0,
  '矿物质水': 0
};

const energyController = {
  async getEnergy(req: Request, res: Response) {
    try {
      const { drinkName } = req.query;
      
      if (!drinkName) {
        return res.status(400).json({ message: '请提供饮料名称' });
      }
      
      const energy = energyData[drinkName as string] || 0;
      
      res.json({
        name: drinkName,
        energy: energy,
        unit: 'kcal/100ml'
      });
    } catch (error) {
      console.error('查询能量失败:', error);
      res.status(500).json({ message: '服务器内部错误' });
    }
  }
};

export default energyController;