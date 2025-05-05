import { useState, useEffect } from 'react';
import { Heart, Smile, Frown, Meh } from 'lucide-react';
import healthMonitorApi from '../request/api';

export default function HealthMonitoringWidget({ isMock = false, uid = '12' }) {
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    breathing: 'normal',
    breathingDetail: '正常',
    heartRhythm: 'normal',
    heartRhythmDetail: '正常',
    stress: 80,
    emotion: 'happy',
  });

  // 获取呼吸状态文本
  const getBreathingStatus = (status) => {
    switch (status) {
      case 1:
        return { status: 'normal', detail: '正常' };
      case 2:
        return { status: 'abnormal', detail: '空气阻塞' };
      case 3:
        return { status: 'abnormal', detail: '呼吸暂停' };
      case 4:
        return { status: 'unknown', detail: '未知' };
      default:
        return { status: 'unknown', detail: '未知' };
    }
  };

  // 获取心律状态文本
  const getHeartRhythmStatus = (status) => {
    switch (status) {
      case 1:
        return { status: 'normal', detail: '正常' };
      case 2:
        return { status: 'abnormal', detail: '非正常' };
      default:
        return { status: 'unknown', detail: '未知' };
    }
  };

  useEffect(() => {
    let interval;

    if (isMock) {
      // 模拟数据更新逻辑
      interval = setInterval(() => {
        setHealthData(prev => ({
          ...prev,
          heartRate: Math.floor(Math.random() * 20) + 65,
          breathing: Math.random() > 0.8 ? 'abnormal' : 'normal',
          breathingDetail: Math.random() > 0.8 ? '异常' : '正常',
          heartRhythm: Math.random() > 0.9 ? 'abnormal' : 'normal',
          heartRhythmDetail: Math.random() > 0.9 ? '非正常' : '正常',
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
      const fetchData = async () => {
        try {
          const healthInfo = await healthMonitorApi.getHealthInfo(uid);
          console.log('API Response:', healthInfo);
          if (healthInfo && !healthInfo.userLeft) {
            const breathingStatus = getBreathingStatus(healthInfo.breath_status);
            const heartRhythmStatus = getHeartRhythmStatus(healthInfo.arr);
            
            setHealthData({
              heartRate: healthInfo.heart || 72,
              breathing: breathingStatus.status,
              breathingDetail: breathingStatus.detail,
              heartRhythm: heartRhythmStatus.status,
              heartRhythmDetail: heartRhythmStatus.detail,
              stress: healthInfo.stress || 80,
              emotion: healthInfo.stress < 40 ? 'happy' : healthInfo.stress < 70 ? 'neutral' : 'sad'
            });
          }
        } catch (error) {
          console.error('Error fetching health info:', error);
        }
      };

      // 立即执行一次
      fetchData();
      
      // 设置定时器
      interval = setInterval(fetchData, 3000);
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
              className={`${
                healthData.breathing === 'normal' ? 'text-blue-500' : 
                healthData.breathing === 'abnormal' ? 'text-amber-500' : 
                'text-gray-500'
              }`}
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
          <div className={`text-sm font-bold mt-1 ${
            healthData.breathing === 'normal' ? 'text-blue-500' : 
            healthData.breathing === 'abnormal' ? 'text-amber-500' : 
            'text-gray-500'
          }`}>
            {healthData.breathingDetail}
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
              className={`${
                healthData.heartRhythm === 'normal' ? 'text-green-500' : 
                healthData.heartRhythm === 'abnormal' ? 'text-red-500' : 
                'text-gray-500'
              }`}
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
          <div className={`text-sm font-bold mt-1 ${
            healthData.heartRhythm === 'normal' ? 'text-green-500' : 
            healthData.heartRhythm === 'abnormal' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            {healthData.heartRhythmDetail}
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