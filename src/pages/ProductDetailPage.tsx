import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store';
import Navbar from '../components/Navbar';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProduct, setSelectedProduct } = useProductStore();
  
  useEffect(() => {
    if (id) {
      // 获取产品详情
      fetch(`http://localhost:3001/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => setSelectedProduct(data))
        .catch((error) => console.error('获取产品详情失败:', error));
    }
  }, [id, setSelectedProduct]);
  
  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>加载中...</p>
        <Navbar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航栏 */}
      <div className="bg-blue-600 text-white py-4 px-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white">
          ← 返回
        </button>
        <h1 className="text-xl font-bold">产品详情</h1>
        <div className="w-8"></div>
      </div>
      
      {/* 产品图片 */}
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
      </div>
      
      {/* 产品信息 */}
      <div className="bg-white p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
        <p className="text-blue-600 font-bold text-lg mb-4">¥{selectedProduct.price}</p>
        <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
          立即购买
        </button>
      </div>
      
      {/* 营养成分 */}
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">营养成分表</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left text-gray-600">营养成分</th>
                <th className="py-2 text-right text-gray-600">每100ml含量</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-700">能量</td>
                <td className="py-2 text-right text-gray-700">{selectedProduct.nutrition.energy} kcal</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-700">蛋白质</td>
                <td className="py-2 text-right text-gray-700">{selectedProduct.nutrition.protein} g</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-700">脂肪</td>
                <td className="py-2 text-right text-gray-700">{selectedProduct.nutrition.fat} g</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-700">碳水化合物</td>
                <td className="py-2 text-right text-gray-700">{selectedProduct.nutrition.carbohydrate} g</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default ProductDetailPage;