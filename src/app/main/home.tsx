import React, { useState } from 'react';
import Work from './works';
import Inspiration from './inspiration';
import Entry from './entry';

const Home: React.FC = () => {
  const [activeComponent, ] = useState('');

  return (
    <div>
      <h2>当前选中: {activeComponent === '' ? '主页' : activeComponent === 'work' ? '我的作品' : activeComponent === 'inspiration' ? '灵感库' : ''}</h2>
      {activeComponent === 'work' && <Work />}
      {activeComponent === 'inspiration' && <Inspiration />}
      {activeComponent===''&&<Entry />}
    </div>
  );
};

export default Home;