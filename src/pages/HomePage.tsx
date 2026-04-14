import React, { useEffect } from 'react';
import { useFactoryStore, useProductStore } from '../store';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  const { factory, setFactory } = useFactoryStore();
  const { products, setProducts } = useProductStore();
  
  useEffect(() => {
    // 获取水厂信息
    fetch('/api/water-factory')
      .then((response) => response.json())
      .then((data) => setFactory(data))
      .catch((error) => console.error('获取水厂信息失败:', error));

    // 获取产品列表
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('获取产品列表失败:', error));
  }, [setFactory, setProducts]);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部轮播图 */}
      <div className="relative h-48 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold">{factory?.name || '清泉水厂'}</h1>
        </div>
      </div>
      
      {/* 水厂信息 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">关于我们</h2>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p className="text-gray-600 mb-4">{factory?.description || '清泉水厂成立于1998年，位于风景秀丽的山区，采用天然山泉水，经过多重过滤和消毒处理，为消费者提供优质的饮用水。'}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">发展历史</h3>
            <p className="text-gray-600">{factory?.history || '1998年建厂，2000年通过ISO9001质量认证，2005年获得国家免检产品称号，2010年扩建生产线，2015年推出高端矿泉水系列。'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">荣誉资质</h3>
            <div className="flex flex-wrap gap-2">
              {(factory?.honors || ['国家免检产品', '中国驰名商标', '消费者信得过产品', '绿色食品认证']).map((honor, index) => (
                <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  {honor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 产品展示 */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">我们的产品</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-40 bg-white rounded-lg shadow-sm overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-blue-600 font-bold">¥{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 快速入口 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">快速入口</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-blue-600 font-bold">产品</span>
            </div>
            <span className="text-xs text-gray-600">全部产品</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-green-600 font-bold">提醒</span>
            </div>
            <span className="text-xs text-gray-600">喝水提醒</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-yellow-600 font-bold">能量</span>
            </div>
            <span className="text-xs text-gray-600">能量查询</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-purple-600 font-bold">我的</span>
            </div>
            <span className="text-xs text-gray-600">个人中心</span>
          </div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default HomePage;