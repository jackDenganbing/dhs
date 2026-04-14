import pool from '../config/database';

// 数据库初始化函数
export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建提醒表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reminders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        time VARCHAR(10) NOT NULL,
        frequency INT NOT NULL,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // 创建查询历史表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS query_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        drink_name VARCHAR(100) NOT NULL,
        energy FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // 创建水厂表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS water_factory (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        history TEXT NOT NULL,
        honors TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建产品表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        factory_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (factory_id) REFERENCES water_factory(id) ON DELETE CASCADE
      )
    `);
    
    // 创建营养成分表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS nutrition (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        energy FLOAT NOT NULL,
        protein FLOAT NOT NULL,
        fat FLOAT NOT NULL,
        carbohydrate FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    
    // 检查是否已有水厂数据
    const [factoryResult] = await connection.execute('SELECT COUNT(*) as count FROM water_factory');
    const factoryCount = (factoryResult as any)[0].count;
    
    if (factoryCount === 0) {
      // 插入初始水厂数据
      await connection.execute(`
        INSERT INTO water_factory (name, description, history, honors) VALUES (
          '清泉水厂',
          '清泉水厂成立于1998年，位于风景秀丽的山区，采用天然山泉水，经过多重过滤和消毒处理，为消费者提供优质的饮用水。',
          '1998年建厂，2000年通过ISO9001质量认证，2005年获得国家免检产品称号，2010年扩建生产线，2015年推出高端矿泉水系列。',
          '国家免检产品、中国驰名商标、消费者信得过产品、绿色食品认证'
        )
      `);
      
      // 插入产品数据
      await connection.execute(`
        INSERT INTO products (factory_id, name, price, description, image) VALUES
        (1, '清泉矿泉水', 2.5, '天然山泉水，富含多种矿物质，口感清冽甘甜', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mineral%20water%20bottle%20blue%20label&image_size=square'),
        (1, '清泉纯净水', 1.5, '经过多重过滤的纯净水，适合日常饮用', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pure%20water%20bottle%20transparent&image_size=square'),
        (1, '清泉碱性水', 3.5, 'pH值7.5-8.5的碱性水，有助于调节体内酸碱平衡', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=alkaline%20water%20bottle%20green%20label&image_size=square'),
        (1, '清泉矿物质水', 2.0, '添加了人体所需的多种矿物质，营养更均衡', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mineral%20enhanced%20water%20bottle&image_size=square')
      `);
      
      // 插入营养成分数据
      await connection.execute(`
        INSERT INTO nutrition (product_id, energy, protein, fat, carbohydrate) VALUES
        (1, 0, 0, 0, 0),
        (2, 0, 0, 0, 0),
        (3, 0, 0, 0, 0),
        (4, 0, 0, 0, 0)
      `);
    }
    
    // 检查是否已有测试用户
    const [userResult] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const userCount = (userResult as any)[0].count;
    
    if (userCount === 0) {
      // 插入测试用户
      await connection.execute(`
        INSERT INTO users (phone, password, name) VALUES
        ('13800138000', '123456', '测试用户')
      `);
    }
    
    connection.release();
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

export default initDatabase;