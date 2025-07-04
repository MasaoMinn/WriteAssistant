import React from 'react';

// 模拟最近7天的编辑字数数据
const mockEditData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000));

const Entry: React.FC = () => {
  // 获取最近7天的日期
  const getLast7Days = () => {
    const dates = [];
    for (let i = 7; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push({
        fullDate: date.toISOString().split('T')[0],
        day: date.getDate()
      });
    }
    return dates;
  };

  const last7Days = getLast7Days();

  // 根据字数计算颜色深度
  const getColor = (words:number) => {
    const maxWords = 5000;
    const ratio = Math.min(words / maxWords, 1);
    const greenValue = 255 - Math.floor(155 * ratio);
    return `rgb(0, ${greenValue}, 0)`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>今日创作：<b>357</b> 字</h2>
      <br />
      <h2>最近一周编辑字数</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {last7Days.map((day, index) => (
          <div
            key={day.fullDate}
            style={{ 
              width: '10vh', 
              height: '10vh', 
              backgroundColor: getColor(mockEditData[index]), 
              borderRadius: '4px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              cursor: 'pointer' 
            }}
            onMouseOver={(e) => (e.target as HTMLElement).title = `${mockEditData[index]} 字`}
          >
            <div style={{ textAlign: 'center' }}>
              {day.fullDate}<br />
              创作{Math.floor(mockEditData[index]/3)}字
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Entry;