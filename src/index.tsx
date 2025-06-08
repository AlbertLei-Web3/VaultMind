/**
 * index.tsx
 * React 应用入口文件 / React Application Entry File
 * 
 * 这个文件是 React 应用的入口点，负责渲染根组件
 * This file is the entry point of the React application, responsible for rendering the root component
 * 
 * 相关文件 / Related files:
 * - src/App.tsx (主应用组件 / Main Application Component)
 * - src/components/TradingCalculator.tsx (交易计算器组件 / Trading Calculator Component)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 