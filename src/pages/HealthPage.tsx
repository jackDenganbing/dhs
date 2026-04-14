import React, { useState, useEffect } from 'react';
import { useReminderStore, useQueryHistoryStore, useUserStore } from '../store';
import Navbar from '../components/Navbar';

const HealthPage: React.FC = () => {
  const { user } = useUserStore();
  const { reminders, setReminders, addReminder, updateReminder, deleteReminder } = useReminderStore();
  const { addHistory } = useQueryHistoryStore();
  
  // 喝水提醒状态
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState(2);
  const [enabled, setEnabled] = useState(true);
  
  // 能量查询状态
  const [drinkName, setDrinkName] = useState('');
  const [energyResult, setEnergyResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      // 获取用户提醒列表
      fetch(`/api/reminders/${user.id}`)
        .then((response) => response.json())
        .then((data) => setReminders(data))
        .catch((error) => console.error('获取提醒列表失败:', error));
    }
  }, [user, setReminders]);

  const handleAddReminder = () => {
    if (user) {
      const newReminder = {
        userId: user.id,
        time,
        frequency,
        enabled
      };

      fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReminder)
      })
        .then((response) => response.json())
        .then((data) => {
          addReminder(data);
          // 重置表单
          setTime('08:00');
          setFrequency(2);
          setEnabled(true);
        })
        .catch((error) => console.error('创建提醒失败:', error));
    }
  };

  const handleUpdateReminder = (id: number) => {
    const updatedReminder = {
      time,
      frequency,
      enabled
    };

    fetch(`/api/reminders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedReminder)
    })
      .then((response) => response.json())
      .then((data) => updateReminder(id, data))
      .catch((error) => console.error('更新提醒失败:', error));
  };

  const handleDeleteReminder = (id: number) => {
    fetch(`/api/reminders/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then(() => deleteReminder(id))
      .catch((error) => console.error('删除提醒失败:', error));
  };

  const handleEnergyQuery = () => {
    setLoading(true);
    fetch(`/api/energy?drinkName=${encodeURIComponent(drinkName)}`)
      .then((response) => response.json())
      .then((data) => {
        setEnergyResult(data);
        // 保存查询历史
        if (user) {
          const historyItem = {
            userId: user.id,
            drinkName: data.name,
            energy: data.energy
          };
          fetch('/api/query-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(historyItem)
          })
            .then((response) => response.json())
            .then((historyData) => addHistory(historyData))
            .catch((error) => console.error('保存查询历史失败:', error));
        }
      })
      .catch((error) => console.error('查询能量失败:', error))
      .finally(() => setLoading(false));
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航栏 */}
      <div className="bg-blue-600 text-white py-4 px-4 flex items-center">
        <h1 className="text-xl font-bold">健康管理</h1>
      </div>
      
      {/* 喝水提醒 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">喝水提醒</h2>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">提醒时间</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">提醒频率（小时）</label>
            <input
              type="range"
              min="1"
              max="4"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-gray-600">{frequency} 小时</div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">启用提醒</span>
            </label>
          </div>
          <button
            onClick={handleAddReminder}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            添加提醒
          </button>
        </div>
        
        {/* 提醒列表 */}
        <div className="bg-white rounded-lg shadow-sm p-4">
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
                  <div className="flex items-center">
                    <label className="mr-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={(e) => {
                          setEnabled(e.target.checked);
                          handleUpdateReminder(reminder.id);
                        }}
                        className="mr-2"
                      />
                      <span className="text-gray-700 text-sm">启用</span>
                    </label>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 能量查询 */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">能量查询</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">饮料名称</label>
            <input
              type="text"
              value={drinkName}
              onChange={(e) => setDrinkName(e.target.value)}
              placeholder="请输入饮料名称"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            onClick={handleEnergyQuery}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? '查询中...' : '查询能量'}
          </button>
          
          {energyResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">查询结果</h3>
              <p className="text-gray-600">饮料：{energyResult.name}</p>
              <p className="text-gray-600">能量：{energyResult.energy} {energyResult.unit}</p>
            </div>
          )}
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default HealthPage;