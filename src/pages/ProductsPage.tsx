import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store';
import Navbar from '../components/Navbar';

const ProductsPage: React.FC = () => {
  const { products, setProducts } = useProductStore();
  
  useEffect(() => {
    // 获取产品列表
    fetch('http://localhost:3001/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('获取产品列表失败:', error));
  }, [setProducts]);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航栏 */}
      <div className="bg-blue-600 text-white py-4 px-4 flex items-center">
        <h1 className="text-xl font-bold">产品列表</h1>
      </div>
      
      {/* 产品列表 */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 font-bold">¥{product.price}</p>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">查看详情</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default ProductsPage;