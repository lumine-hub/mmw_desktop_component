import { useEffect, useState } from 'react';
import HealthWidget from './components/Health2';

function App() {
  const [data, setData] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    // 从 URL 获取 uid 参数
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uidFromUrl = urlParams.get('uid');

    // 处理 uid：如果能获取到并且是有效数字则使用，否则使用默认值 '12345'
    if (uidFromUrl !== null) {
      const parsedUid = Number(uidFromUrl);
      setUid(isNaN(parsedUid) ? '12345' : String(parsedUid));
    } else {
      setUid('12345'); // 默认值
    }

    // 获取数据
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {uid && (
        <>
          <HealthWidget size="small" uid={uid} />
        </>
      )}
    </div>
  );
}

export default App;
