import React, { useState, useEffect } from 'react';
import './HealthMonitorWidget.css'; // Make sure to create this CSS file

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
    return `${60 / rate}s`;
  };

  // Helper function for status colors
  const getStatusColor = (status) => {
    if (status === 'Normal') return 'green';
    if (status === 'Active') return 'yellow';
    if (status === 'Resting') return 'blue';
    return 'red';
  };

  return (
    <div className="health-monitor-widget">
      {/* Header */}
      <div className="widget-header">
        <h2 className="header-title">Health Monitor</h2>
        <div className="header-time">{time.toLocaleTimeString()}</div>
      </div>
      
      {/* Main content */}
      <div className="widget-content">
        {/* Heart Rate */}
        <div className="widget-card">
          <div className="card-label">Heart Rate</div>
          <div className="metrics-container">
            <div className="metric-value">{Math.round(heartRate)}</div>
            <div className="metric-unit">BPM</div>
            <div className={`metric-status ${getHeartRateStatus(heartRate).toLowerCase()}`}>
              {getHeartRateStatus(heartRate)}
            </div>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar heart-rate" 
              style={{ 
                width: `${(heartRate - 40) / 100 * 100}%`,
                animationDuration: getHeartbeatDuration(heartRate)
              }}
            />
          </div>
        </div>
        
        {/* Breathing Status */}
        <div className="widget-card">
          <div className="card-label">Breathing Rate</div>
          <div className="metrics-container">
            <div className="metric-value">{Math.round(breathingRate)}</div>
            <div className="metric-unit">br/min</div>
          </div>
          <div className="breathing-indicator">
            <div 
              className="breathing-circle" 
              style={{ animationDuration: `${60/breathingRate}s` }}
            />
            <div className="breathing-status">
              {breathingRate < 14 ? 'Slow' : breathingRate > 18 ? 'Fast' : 'Normal'}
            </div>
          </div>
        </div>
        
        {/* isArrhythmia */}
        <div className="widget-card">
          <div className="card-label">isArrhythmia</div>
          <div className="arrhythmia-container">
            <div className={`arrhythmia-indicator ${isArrhythmia ? 'abnormal' : 'normal'}`} />
            <div className="arrhythmia-status">
              {isArrhythmia ? 'Abnormal' : 'Normal'}
            </div>
          </div>
          <div className="arrhythmia-description">
            {isArrhythmia ? 'Irregular heartbeat detected' : 'Regular heart rhythm'}
          </div>
        </div>
        
        {/* Body Status */}
        <div className="widget-card">
          <div className="card-label">Body Status</div>
          <div className="body-status-value">{bodyStatus}</div>
          <div className="body-status-indicator">
            <div className={`status-circle ${bodyStatus.toLowerCase()}`} />
            <div className="status-text">Status: {bodyStatus}</div>
          </div>
        </div>
      </div>
      
      {/* Human body silhouette */}
      <div className="body-visualization-container">
        <div className="body-visualization">
          <div className="human-silhouette">
            {/* Simple human body silhouette */}
            <div className="head" />
            <div className="torso" />
            <div className="arm left" />
            <div className="arm right" />
            <div className="leg left" />
            <div className="leg right" />
            
            {/* Heart position with pulsing effect */}
            <div 
              className={`heart ${isArrhythmia ? 'arrhythmia' : 'normal'}`}
              style={{ 
                animationDuration: getHeartbeatDuration(heartRate)
              }}
            />
            
            {/* Lungs with breathing animation */}
            <div 
              className="lung left"
              style={{ animationDuration: `${60/breathingRate}s` }}
            />
            <div 
              className="lung right"
              style={{ animationDuration: `${60/breathingRate}s` }}
            />
          </div>
          
          <div className="assessment">
            <div className="assessment-title">Overall Assessment</div>
            <div className="assessment-details">
              Heart rate is {getHeartRateStatus(heartRate).toLowerCase()}, 
              breathing is {breathingRate < 14 ? 'slow' : breathingRate > 18 ? 'elevated' : 'normal'}.
              {isArrhythmia ? ' Arrhythmia detected.' : ' No arrhythmia detected.'} 
              Body status: {bodyStatus.toLowerCase()}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitorWidget;