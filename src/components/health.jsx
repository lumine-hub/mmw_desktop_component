import React, { useState, useEffect, useRef } from 'react';
import './HealthMonitorWidget.css';
import healthMonitorApi from '../request/api'; // Import the API service

const HealthMonitorWidget = ({ uid = '0', initialWidth = 400 }) => { // Default UID and size
  // State for various health metrics
  const [heartRate, setHeartRate] = useState(75);
  const [breathingStatus, setBreathingStatus] = useState('Normal');
  const [isArrhythmia, setIsArrhythmia] = useState(false);
  const [bodyStatus, setBodyStatus] = useState('Unknown');
  const [warningInfo, setWarningInfo] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [isInBed, setIsInBed] = useState(true);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLeft, setUserLeft] = useState(false);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: initialWidth, height: 'auto' });
  const [initialSize, setInitialSize] = useState({ width: initialWidth, height: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  
  // Minimize state
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Refs
  const widgetRef = useRef(null);
  
  // Function to fetch all health data
  const fetchHealthData = async () => {
    try {
      let userLeftStatus = false;
      
      // Fetch heart rate
      const heartRateData = await healthMonitorApi.getHeartRate(uid);
      if (heartRateData.userLeft) {
        userLeftStatus = true;
      } else if (heartRateData.value !== null) {
        setHeartRate(heartRateData.value);
      }
      
      // Fetch arrhythmia status
      const arrhythmiaStatus = await healthMonitorApi.getArrhythmiaStatus(uid);
      if (arrhythmiaStatus.userLeft) {
        userLeftStatus = true;
      } else {
        setIsArrhythmia(arrhythmiaStatus.value);
      }
      
      // Fetch body status
      const bodyStatusData = await healthMonitorApi.getBodyStatus(uid);
      if (bodyStatusData.userLeft) {
        userLeftStatus = true;
      }
      setBodyStatus(bodyStatusData.status);
      setIsWarning(bodyStatusData.isWarning);
      setWarningInfo(bodyStatusData.warningInfo);
      
      // Fetch breathing status
      const breathingData = await healthMonitorApi.getBreathingStatus(uid);
      if (breathingData.userLeft) {
        userLeftStatus = true;
      }
      setBreathingStatus(breathingData.status);
      setIsInBed(breathingData.isInBed);
      
      // Update user left status
      setUserLeft(userLeftStatus);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching health data:', err);
      setError('Failed to fetch health data. Please try again later.');
      setLoading(false);
    }
  };

  // Initial data fetch and set up polling
  useEffect(() => {
    // Fetch data immediately
    fetchHealthData();
    
    // Set up polling interval (every 5 seconds)
    const intervalId = setInterval(() => {
      fetchHealthData();
      setTime(new Date());
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [uid]);
  
  // Handle mouse events for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep widget within viewport bounds
        const maxX = window.innerWidth - widgetRef.current.offsetWidth;
        const maxY = window.innerHeight - widgetRef.current.offsetHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      } else if (isResizing) {
        const newWidth = initialSize.width + (e.clientX - resizeStart.x);
        // We use a proportional height calculation based on content
        
        setSize({
          width: Math.max(250, Math.min(newWidth, window.innerWidth - position.x)), // Min/max width constraints
          height: 'auto' // Let height adjust to content
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, initialSize, position]);
  
  // Start dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.widget-controls')) return;
    
    setIsDragging(true);
    const rect = widgetRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Start resizing
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
    
    const rect = widgetRef.current.getBoundingClientRect();
    setInitialSize({
      width: rect.width,
      height: rect.height
    });
  };
  
  // Toggle minimize state
  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
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

  // Widget container style
  const widgetStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: isMinimized ? 'auto' : (size.height === 'auto' ? 'auto' : `${size.height}px`),
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: 1000,
  };

  // Display loading state
  if (loading) {
    return (
      <div 
        ref={widgetRef}
        className="health-monitor-widget loading desktop-widget"
        style={widgetStyle}
        onMouseDown={handleMouseDown}
      >
        <div className="widget-header">
          <h2 className="header-title">Health Monitor</h2>
          <div className="widget-controls">
            <div className="control-button minimize-button" onClick={handleMinimize}>{isMinimized ? '+' : '-'}</div>
          </div>
        </div>
        <div className={`widget-body ${isMinimized ? 'minimized' : ''}`}>
          Loading health data...
        </div>
        <div className="resize-handle" onMouseDown={handleResizeStart}></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div 
        ref={widgetRef}
        className="health-monitor-widget error desktop-widget"
        style={widgetStyle}
        onMouseDown={handleMouseDown}
      >
        <div className="widget-header">
          <h2 className="header-title">Health Monitor</h2>
          <div className="widget-controls">
            <div className="control-button minimize-button" onClick={handleMinimize}>{isMinimized ? '+' : '-'}</div>
          </div>
        </div>
        <div className={`widget-body ${isMinimized ? 'minimized' : ''}`}>
          {error}
        </div>
        <div className="resize-handle" onMouseDown={handleResizeStart}></div>
      </div>
    );
  }

  // Display user left state
  if (userLeft) {
    return (
      <div 
        ref={widgetRef}
        className="health-monitor-widget user-left desktop-widget"
        style={widgetStyle}
        onMouseDown={handleMouseDown}
      >
        <div className="widget-header">
          <h2 className="header-title">Health Monitor</h2>
          <div className="header-time">{time.toLocaleTimeString()}</div>
          <div className="widget-controls">
            <div className="control-button minimize-button" onClick={handleMinimize}>{isMinimized ? '+' : '-'}</div>
          </div>
        </div>
        <div className={`widget-body ${isMinimized ? 'minimized' : ''}`}>
          <div className="user-left-message">
            <div className="user-left-icon">👤</div>
            <h3>用户已离开</h3>
            <p>User has left the monitoring area</p>
            <p className="retry-message">Attempting to reconnect... (Next attempt in {5} seconds)</p>
          </div>
        </div>
        <div className="resize-handle" onMouseDown={handleResizeStart}></div>
      </div>
    );
  }

  return (
    <div 
      ref={widgetRef}
      className="health-monitor-widget desktop-widget"
      style={widgetStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="widget-header">
        <h2 className="header-title">Health Monitor</h2>
        <div className="header-time">{time.toLocaleTimeString()}</div>
        <div className="widget-controls">
          <div className="control-button minimize-button" onClick={handleMinimize}>{isMinimized ? '+' : '-'}</div>
        </div>
      </div>
      
      {/* Main content - hidden when minimized */}
      <div className={`widget-body ${isMinimized ? 'minimized' : ''}`}>
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
            <div className="card-label">Breathing Status</div>
            <div className="metrics-container">
              <div className="metric-value">{breathingStatus}</div>
            </div>
            <div className="breathing-indicator">
              <div 
                className={`breathing-circle ${breathingStatus !== 'Normal' ? 'abnormal' : 'normal'}`}
                style={{ 
                  animationDuration: breathingStatus === 'Apnea' ? '10s' : '5s',
                  animationPlayState: breathingStatus === 'Apnea' ? 'paused' : 'running'
                }}
              />
              <div className={`breathing-status ${breathingStatus !== 'Normal' ? 'warning' : ''}`}>
                {breathingStatus}
              </div>
            </div>
          </div>
          
          {/* Arrhythmia */}
          <div className="widget-card">
            <div className="card-label">Arrhythmia</div>
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
              <div className={`status-circle ${isWarning ? 'warning' : 'normal'}`} />
              <div className="status-text">Status: {bodyStatus}</div>
            </div>
            {isWarning && (
              <div className="warning-message">
                Warning: {warningInfo}
              </div>
            )}
          </div>
        </div>
        
        {/* Human body silhouette */}
        
        <div className="body-visualization-container">
          <div className="body-visualization">
            <div className={`human-silhouette ${!isInBed ? 'out-of-bed' : ''}`}>
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
                className={`lung left ${breathingStatus !== 'Normal' ? 'abnormal' : ''}`}
                style={{ 
                  animationDuration: '5s',
                  animationPlayState: breathingStatus === 'Apnea' ? 'paused' : 'running'
                }}
              />
              <div 
                className={`lung right ${breathingStatus !== 'Normal' ? 'abnormal' : ''}`}
                style={{ 
                  animationDuration: '5s',
                  animationPlayState: breathingStatus === 'Apnea' ? 'paused' : 'running'
                }}
              />
            </div>
            
            <div className="assessment">
              <div className="assessment-title">Overall Assessment</div>
              <div className="assessment-details">
                Heart rate is {getHeartRateStatus(heartRate).toLowerCase()}, 
                breathing status is {breathingStatus.toLowerCase()}.
                {isArrhythmia ? ' Arrhythmia detected.' : ' No arrhythmia detected.'} 
                Body status: {bodyStatus.toLowerCase()}.
                {isWarning && ` Warning: ${warningInfo}`}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resize handle - hidden when minimized */}
      {!isMinimized && <div className="resize-handle" onMouseDown={handleResizeStart}></div>}
    </div>
  );
};

export default HealthMonitorWidget;