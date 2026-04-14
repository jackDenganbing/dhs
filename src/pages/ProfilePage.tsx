import React, { useEffect, useState } from 'react';
import { useUserStore, useReminderStore, useQueryHistoryStore } from '../store';
import Navbar from '../components/Navbar';

const ProfilePage: React.FC = () => {
  const { user, setUser, clearUser } = useUserStore();
  const { reminders } = useReminderStore();
  const { history, setHistory } = useQueryHistoryStore();
  
  // 登录状态
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true: 登录, false: 注册
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      // 获取用户查询历史
      fetch(`http://localhost:3001/api/query-history/${user.id}`)
        .then((response) => response.json())
        .then((data) => setHistory(data))
        .catch((error) => console.error('获取查询历史失败:', error));
    }
  }, [user, setHistory]);
  
  const handleLogin = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, password })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          setUser(data.user, data.token);
        }
      })
      .catch((error) => console.error('登录失败:', error))
      .finally(() => setLoading(false));
  };
  
  const handleRegister = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, password, name })
    })
      .then((response) => response.json())
      .then((data) => {
        // 注册成功后自动登录
        handleLogin();
      })
      .catch((error) => console.error('注册失败:', error))
      .finally(() => setLoading(false));
  };
  
  const handleLogout = () => {
    clearUser();
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? '登录' : '注册'}
          </h1>
          
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-4"
          >
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>
          
          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600"
            >
              {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>
        </div>
        <Navbar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航栏 */}
      <div className="bg-blue-600 text-white py-4 px-4 flex items-center">
        <h1 className="text-xl font-bold">个人中心</h1>
      </div>
      
      {/* 用户信息 */}
      <div className="bg-white p-4 mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-blue-600 font-bold text-xl">{user.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold"
        >
          退出登录
        </button>
      </div>
      
      {/* 提醒记录 */}
      <div className="bg-white p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">我的提醒</h3>
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无提醒</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="border-b border-gray-200 py-3 last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{reminder.time}</p>
                  <p className="text-gray-600 text-sm">每 {reminder.frequency} 小时</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${reminder.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {reminder.enabled ? '已启用' : '已禁用'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 历史查询 */}
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">能量查询历史</h3>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无查询历史</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="border-b border-gray-200 py-3 last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.drinkName}</p>
                  <p className="text-gray-600 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-blue-600 font-semibold">{item.energy} kcal/100ml</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Navbar />
    </div>
  );
};

export default ProfilePage;