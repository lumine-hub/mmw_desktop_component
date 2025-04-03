import React, { useState, useEffect } from 'react';

const HealthMonitorWidget = () => {
  // State for various health metrics
  const [heartRate, setHeartRate] = useState(75);
  const [breathingRate, setBreathingRate] = useState(16);
  const [isArrhythmia, setIsArrhythmia] = useState(false);
  const [bodyStatus, setBodyStatus] = useState('Normal');
  const [time, setTime] = useState(new Date());

  // Function to generate random fluctuations for simulation
  const fluctuate = (value, min, max, change) => {
    let newValue = value + (Math.random() * change * 2 - change);
    return Math.max(min, Math.min(max, newValue));
  };

  // Simulate real-time data updates
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate(prev => fluctuate(prev, 60, 100, 2));
      setBreathingRate(prev => fluctuate(prev, 12, 20, 1));
      
      // Randomly change arrhythmia status occasionally
      if (Math.random() > 0.95) {
        setIsArrhythmia(prev => !prev);
      }
      
      // Randomly change body status occasionally
      if (Math.random() > 0.95) {
        const statuses = ['Normal', 'Active', 'Resting', 'Exercise'];
        setBodyStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }
      
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate heart rate status based on current rate
  const getHeartRateStatus = (rate) => {
    if (rate < 60) return 'Low';
    if (rate > 100) return 'High';
    return 'Normal';
  };
  
  // Calculate heartbeat animation speed based on rate
  const getHeartbeatDuration = (rate) => {
    return 60 / rate;
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-blue-50 rounded-lg shadow-lg text-slate-800 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-100 p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold text-blue-800">Health Monitor</h2>
        <div className="text-sm text-blue-700">{time.toLocaleTimeString()}</div>
      </div>
      
      {/* Main content */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Heart Rate */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-blue-500 font-medium">Heart Rate</div>
          <div className="flex items-end mt-1">
            <div className="text-2xl font-bold">{Math.round(heartRate)}</div>
            <div className="ml-1 text-sm mb-1">BPM</div>
            <div 
              className={`ml-2 text-xs px-2 py-1 rounded text-white ${
                getHeartRateStatus(heartRate) === 'Normal' 
                  ? 'bg-green-500' 
                  : getHeartRateStatus(heartRate) === 'High' 
                    ? 'bg-red-500' 
                    : 'bg-blue-500'
              }`}
            >
              {getHeartRateStatus(heartRate)}
            </div>
          </div>
          <div className="mt-2 relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-red-400 rounded-full"
              style={{ 
                width: `${(heartRate - 40) / 100 * 100}%`,
                animation: `pulse ${getHeartbeatDuration(heartRate)}s ease-in-out infinite` 
              }}
            />
          </div>
        </div>
        
        {/* Breathing Status */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-blue-500 font-medium">Breathing Rate</div>
          <div className="flex items-end mt-1">
            <div className="text-2xl font-bold">{Math.round(breathingRate)}</div>
            <div className="ml-1 text-sm mb-1">br/min</div>
          </div>
          <div className="mt-2 flex items-center">
            <div 
              className="w-6 h-6 bg-blue-400 rounded-full opacity-70"
              style={{ 
                animation: `breathe ${60/breathingRate}s ease-in-out infinite` 
              }}
            />
            <div className="ml-2 text-xs">
              {breathingRate < 14 ? 'Slow' : breathingRate > 18 ? 'Fast' : 'Normal'}
            </div>
          </div>
        </div>
        
        {/* isArrhythmia (previously Practice Heart Rate) */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-blue-500 font-medium">isArrhythmia</div>
          <div className="flex items-center mt-2">
            <div 
              className={`w-4 h-4 rounded-full ${isArrhythmia ? 'bg-red-500' : 'bg-green-500'}`}
            />
            <div className="ml-2 text-lg font-semibold">
              {isArrhythmia ? 'Abnormal' : 'Normal'}
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-slate-600">
              {isArrhythmia 
                ? 'Irregular heartbeat detected' 
                : 'Regular heart rhythm'
              }
            </div>
          </div>
        </div>
        
        {/* Body Status */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-blue-500 font-medium">Body Status</div>
          <div className="mt-1">
            <div className="text-xl font-bold">{bodyStatus}</div>
          </div>
          <div className="mt-2 flex items-center">
            <div className={`w-3 h-3 rounded-full ${
              bodyStatus === 'Normal' ? 'bg-green-500' :
              bodyStatus === 'Active' ? 'bg-yellow-500' :
              bodyStatus === 'Resting' ? 'bg-blue-500' : 'bg-red-500'
            }`} />
            <div className="ml-2 text-xs">Status: {bodyStatus}</div>
          </div>
        </div>
      </div>
      
      {/* Human body silhouette */}
      <div className="px-4 pb-4">
        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
          <div className="relative w-16 h-24">
            {/* Simple human body silhouette */}
            <div className="w-6 h-6 bg-slate-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
            <div className="w-10 h-10 bg-slate-400 rounded-md absolute top-6 left-1/2 transform -translate-x-1/2" />
            <div className="w-2 h-8 bg-slate-400 absolute top-8 left-2" />
            <div className="w-2 h-8 bg-slate-400 absolute top-8 right-2" />
            <div className="w-2 h-10 bg-slate-400 absolute bottom-0 left-4" />
            <div className="w-2 h-10 bg-slate-400 absolute bottom-0 right-4" />
            
            {/* Heart position with pulsing effect */}
            <div 
              className={`absolute w-4 h-4 rounded-full top-8 left-1/2 transform -translate-x-1/2 ${
                isArrhythmia ? 'bg-red-500' : 'bg-red-400'
              }`}
              style={{ 
                animation: isArrhythmia 
                  ? `arrhythmia ${getHeartbeatDuration(heartRate)}s ease-in-out infinite` 
                  : `heartbeat ${getHeartbeatDuration(heartRate)}s ease-in-out infinite`,
                opacity: 0.8
              }}
            />
            
            {/* Lungs with breathing animation */}
            <div 
              className="absolute w-3 h-4 bg-blue-300 rounded-md top-8 left-2"
              style={{ 
                animation: `breathe ${60/breathingRate}s ease-in-out infinite`,
                opacity: 0.6
              }}
            />
            <div 
              className="absolute w-3 h-4 bg-blue-300 rounded-md top-8 right-2"
              style={{ 
                animation: `breathe ${60/breathingRate}s ease-in-out infinite`,
                opacity: 0.6
              }}
            />
          </div>
          
          <div className="ml-4 flex-1">
            <div className="text-sm font-medium text-blue-700">Overall Assessment</div>
            <div className="mt-1 text-xs text-slate-600">
              Heart rate is {getHeartRateStatus(heartRate).toLowerCase()}, 
              breathing is {breathingRate < 14 ? 'slow' : breathingRate > 18 ? 'elevated' : 'normal'}.
              {isArrhythmia ? ' Arrhythmia detected.' : ' No arrhythmia detected.'} 
              Body status: {bodyStatus.toLowerCase()}.
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes heartbeat {
          0% { transform: translate(-50%, 0) scale(1); }
          15% { transform: translate(-50%, 0) scale(1.3); }
          30% { transform: translate(-50%, 0) scale(1); }
          45% { transform: translate(-50%, 0) scale(1.2); }
          60% { transform: translate(-50%, 0) scale(1); }
          100% { transform: translate(-50%, 0) scale(1); }
        }
        
        @keyframes arrhythmia {
          0% { transform: translate(-50%, 0) scale(1); }
          10% { transform: translate(-52%, 0) scale(1.4); }
          25% { transform: translate(-48%, 0) scale(0.9); }
          40% { transform: translate(-50%, 0) scale(1.3); }
          55% { transform: translate(-51%, 0) scale(1); }
          70% { transform: translate(-49%, 0) scale(1.2); }
          85% { transform: translate(-50%, 0) scale(0.95); }
          100% { transform: translate(-50%, 0) scale(1); }
        }
        
        @keyframes breathe {
          0% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(0.8); opacity: 0.4; }
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default HealthMonitorWidget;