import { Request, Response } from 'express';
import pool from '../config/database';

// 模拟产品数据
const mockProducts = [
  {
    id: 1,
    name: '清泉矿泉水',
    price: 2.5,
    description: '天然山泉水，富含多种矿物质，口感清冽甘甜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mineral%20water%20bottle%20blue%20label&image_size=square',
    nutrition: {
      energy: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0
    }
  },
  {
    id: 2,
    name: '清泉纯净水',
    price: 1.5,
    description: '经过多重过滤的纯净水，适合日常饮用',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pure%20water%20bottle%20transparent&image_size=square',
    nutrition: {
      energy: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0
    }
  },
  {
    id: 3,
    name: '清泉碱性水',
    price: 3.5,
    description: 'pH值7.5-8.5的碱性水，有助于调节体内酸碱平衡',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=alkaline%20water%20bottle%20green%20label&image_size=square',
    nutrition: {
      energy: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0
    }
  },
  {
    id: 4,
    name: '清泉矿物质水',
    price: 2.0,
    description: '添加了人体所需的多种矿物质，营养更均衡',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mineral%20enhanced%20water%20bottle&image_size=square',
    nutrition: {
      energy: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0
    }
  }
];

const productController = {
  async getProducts(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, n.energy, n.protein, n.fat, n.carbohydrate 
        FROM products p
        LEFT JOIN nutrition n ON p.id = n.product_id
      `);
      
      const products = (rows as any[]).map((product: any) => {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          nutrition: {
            energy: product.energy,
            protein: product.protein,
            fat: product.fat,
            carbohydrate: product.carbohydrate
          }
        };
      });
      
      res.json(products);
    } catch (error) {
      console.error('获取产品列表失败:', error);
      // 使用模拟数据
      res.json(mockProducts);
    }
  },
  
  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute(`
        SELECT p.*, n.energy, n.protein, n.fat, n.carbohydrate 
        FROM products p
        LEFT JOIN nutrition n ON p.id = n.product_id
        WHERE p.id = ?
      `, [id]);
      
      const product = rows[0];
      
      if (product) {
        const formattedProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          nutrition: {
            energy: product.energy,
            protein: product.protein,
            fat: product.fat,
            carbohydrate: product.carbohydrate
          }
        };
        res.json(formattedProduct);
      } else {
        // 使用模拟数据
        const mockProduct = mockProducts.find(p => p.id === parseInt(id));
        if (mockProduct) {
          res.json(mockProduct);
        } else {
          res.status(404).json({ message: '产品不存在' });
        }
      }
    } catch (error) {
      console.error('获取产品详情失败:', error);
      // 使用模拟数据
      const { id } = req.params;
      const mockProduct = mockProducts.find(p => p.id === parseInt(id));
      if (mockProduct) {
        res.json(mockProduct);
      } else {
        res.status(404).json({ message: '产品不存在' });
      }
    }
  }
};

export default productController;