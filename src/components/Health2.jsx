import { useState, useEffect } from 'react';
import { Heart, Activity, Smile, Frown, Meh } from 'lucide-react';
import healthMonitorApi from '../request/api';  // 添加这行

export default function HealthMonitoringWidget({ isMock = true, uid = '12345' }) {  // 添加props
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    breathing: 'normal',
    heartRhythm: 'normal',
    stress: 80,
    emotion: 'happy', // 替换体动状态为情绪状态
  });

  // 更新useEffect
  useEffect(() => {
    let interval;

    if (isMock) {
      // 模拟数据更新逻辑
      interval = setInterval(() => {
        setHealthData(prev => ({
          ...prev,
          heartRate: Math.floor(Math.random() * 20) + 65,
          breathing: Math.random() > 0.8 ? 'abnormal' : 'normal',
          heartRhythm: Math.random() > 0.9 ? 'abnormal' : 'normal',
          stress: Math.floor(Math.random() * 100) + 1,
          emotion: (() => {
            const rand = Math.random();
            if (rand < 0.5) return 'happy';
            if (rand < 0.8) return 'neutral';
            return 'sad';
          })(),
        }));
      }, 3000);
    } else {
      // 真实数据更新逻辑
      interval = setInterval(async () => {
        try {
          const healthInfo = await healthMonitorApi.getHealthInfo(uid);
          setHealthData({
            heartRate: healthInfo.heartRate,
            breathing: healthInfo.breathingStatus,
            heartRhythm: healthInfo.arrhythmia ? 'abnormal' : 'normal',
            stress: healthInfo.stress,
            emotion: healthInfo.emotion || 'happy', // 替换体动状态为情绪状态
          });
        } catch (error) {
          console.error('Error fetching health info:', error);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isMock, uid]);

  // 获取情绪状态对应的文本
  const getEmotionText = (emotion) => {
    const texts = {
      happy: '愉悦',
      neutral: '平静',
      sad: '低落'
    };
    return texts[emotion] || '未知';
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

        {/* 情绪状态 */}
        <div className="bg-yellow-50 flex flex-col items-center justify-center border border-yellow-100 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            {healthData.emotion === 'happy' && (
              <Smile className="text-green-500" size={28} />
            )}
            {healthData.emotion === 'neutral' && (
              <Meh className="text-blue-500" size={28} />
            )}
            {healthData.emotion === 'sad' && (
              <Frown className="text-red-500" size={28} />
            )}
          </div>
          <div className="text-sm font-medium text-gray-600">
            情绪状态
          </div>
          <div className={`text-sm font-bold mt-1 
            ${healthData.emotion === 'happy' ? 'text-green-500' : 
              healthData.emotion === 'neutral' ? 'text-blue-500' : 'text-red-500'}`
          }>
            {getEmotionText(healthData.emotion)}
          </div>
        </div>
      </div>
    </div>
  );
}