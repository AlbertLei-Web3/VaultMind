/**
 * App.tsx
 * 主应用组件 / Main Application Component
 * 
 * 这个组件是整个应用的根组件，负责渲染交易计算器
 * This component is the root component of the application, responsible for rendering the trading calculator
 * 
 * 相关文件 / Related files:
 * - src/components/TradingCalculator.tsx (交易计算器组件 / Trading Calculator Component)
 * - src/index.tsx (React 渲染入口 / React rendering entry)
 */

import React from 'react';
import TradingCalculator from './components/TradingCalculator';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <TradingCalculator />
    </ConfigProvider>
  );
};

export default App; 