import { useState, useEffect } from 'react';
import { Heart, Activity, Bed } from 'lucide-react';

export default function HealthMonitoringWidget() {
  // 模拟实时数据
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    breathing: 'normal', // 'normal' 或 'abnormal'
    heartRhythm: 'normal', // 'normal' 或 'abnormal'
    bodyMovement: 'inBed', // 'inBed', 'outOfBed', 或 'rolling'
  });

  // 模拟数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData({
        heartRate: Math.floor(Math.random() * 20) + 65, // 65-85之间的随机数
        breathing: Math.random() > 0.8 ? 'abnormal' : 'normal',
        heartRhythm: Math.random() > 0.9 ? 'abnormal' : 'normal',
        bodyMovement: ['inBed', 'outOfBed', 'rolling'][Math.floor(Math.random() * 3)],
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 获取体动状态对应的文本
  const getMovementText = (movement) => {
    const texts = {
      inBed: '在床',
      outOfBed: '离床',
      rolling: '翻滚'
    };
    return texts[movement] || '未知';
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="grid grid-cols-2 gap-0 h-full">
        {/* 心率 */}
        <div className="bg-blue-50 flex flex-col items-center justify-center border border-blue-100 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <Heart 
              className={`text-red-500 animate-pulse ${healthData.heartRhythm === 'abnormal' ? 'animate-bounce' : ''}`} 
              size={28} 
              fill={healthData.heartRhythm === 'normal' ? '#ef4444' : 'none'} 
            />
          </div>
          <div className="text-2xl font-bold text-gray-800">{healthData.heartRate}</div>
          <div className="text-xs text-gray-500 mt-1">BPM</div>
        </div>

        {/* 呼吸状态 */}
        <div className="bg-green-50 flex flex-col items-center justify-center border border-green-100 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={healthData.breathing === 'normal' ? 'text-blue-500' : 'text-amber-500'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 3C4.5 3 3.5 4.5 3.5 6.5C3.5 9 5.5 12 6.5 14C7.5 12 9.5 9 9.5 6.5C9.5 4.5 8.5 3 6.5 3Z" />
              <path d="M17.5 3C15.5 3 14.5 4.5 14.5 6.5C14.5 9 16.5 12 17.5 14C18.5 12 20.5 9 20.5 6.5C20.5 4.5 19.5 3 17.5 3Z" />
              <path d="M3 12C3 14.5 5 18.5 12 18.5C19 18.5 21 14.5 21 12" />
              <path d="M12 18.5V21" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-600">
            呼吸状态
          </div>
          <div className={`text-sm font-bold mt-1 ${healthData.breathing === 'normal' ? 'text-blue-500' : 'text-amber-500'}`}>
            {healthData.breathing === 'normal' ? '正常' : '异常'}
          </div>
        </div>

        {/* 心律状态 */}
        <div className="bg-purple-50 flex flex-col items-center justify-center border border-purple-100 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={healthData.heartRhythm === 'normal' ? 'text-green-500' : 'text-red-500'}
            >
              <path 
                d="M2 12h2l3.5-7 3 14L14 4l2.5 8H22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-600">
            心律状态
          </div>
          <div className={`text-sm font-bold mt-1 ${healthData.heartRhythm === 'normal' ? 'text-green-500' : 'text-red-500'}`}>
            {healthData.heartRhythm === 'normal' ? '正常' : '异常'}
          </div>
        </div>

        {/* 体动状态 */}
        <div className="bg-yellow-50 flex flex-col items-center justify-center border border-yellow-100 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            {healthData.bodyMovement === 'inBed' && (
              <Bed className="text-indigo-500" size={28} />
            )}
            {healthData.bodyMovement === 'outOfBed' && (
              <Activity className="text-orange-500" size={28} />
            )}
            {healthData.bodyMovement === 'rolling' && (
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-500"
              >
                <path 
                  d="M15 15L12 12M12 12L9 9M12 12L9 15M12 12L15 9" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path 
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>
          <div className="text-sm font-medium text-gray-600">
            体动状态
          </div>
          <div className={`text-sm font-bold mt-1 
            ${healthData.bodyMovement === 'inBed' ? 'text-indigo-500' : 
              healthData.bodyMovement === 'outOfBed' ? 'text-orange-500' : 'text-yellow-600'}`
          }>
            {getMovementText(healthData.bodyMovement)}
          </div>
        </div>
      </div>
    </div>
  );
}