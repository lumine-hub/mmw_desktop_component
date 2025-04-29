import { useEffect } from 'react';
import healthMonitorApi from '../request/api';

export default function ScreenController({ uid }) {
  useEffect(() => {
    let interval;

    const controlScreen = async () => {
      try {
        const { status } = await healthMonitorApi.getHumanExist(uid);
        
        // 根据状态控制屏幕
        switch (status) {
          case 1: // 1分钟内从在变成不在
          case 2: // 1分钟内从不在变成在
            console.log('状态变化，保持屏幕开启');
            // TODO: 实现保持屏幕开启的逻辑
            break;
          case 3: // 1分钟内始终不在
            console.log('用户离开，关闭屏幕');
            // TODO: 实现关闭屏幕的逻辑
            break;
          case 4: // 1分钟内始终在
            console.log('用户在场，保持屏幕开启');
            // TODO: 实现保持屏幕开启的逻辑
            break;
          default:
            console.log('未知状态，保持屏幕当前状态');
        }
      } catch (error) {
        console.error('Error controlling screen:', error);
      }
    };

    // 启动轮询
    interval = setInterval(controlScreen, 10000); // 每10秒检查一次

    // 组件卸载时清理
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [uid]);

  // 这个组件不需要渲染任何内容
  return null;
}