/**
 * TradingCalculator.tsx
 * 交易计算器组件 / Trading Calculator Component
 * 
 * 这个组件实现了一个完整的加密货币交易计算器，包含以下功能：
 * This component implements a complete cryptocurrency trading calculator with the following features:
 * 
 * 1. 初始资金配置 / Initial Capital Configuration
 * 2. 仓位管理计划 / Position Management Plan
 * 3. 爆仓价格预估 / Liquidation Price Estimation
 * 4. 风险控制建议 / Risk Control Suggestions
 * 5. 仓位监控表格 / Position Monitoring Table
 * 
 * 相关文件 / Related files:
 * - src/App.tsx (主应用入口 / Main application entry)
 * - src/index.tsx (React 渲染入口 / React rendering entry)
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Table, Card, Space, Typography, Divider } from 'antd';
import { CalculatorOutlined, LineChartOutlined, WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface CalculatorForm {
  totalCapital: number;
  leverage: number;
  initialPrice: number;
  direction: 'long' | 'short';
  additionalPositions: number;
  additionalPositionAmount: number;
  maxLoss: number;
}

interface Position {
  key: number;
  price: number;
  amount: number;
  totalValue: number;
  pnl: number;
}

const TradingCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [positions, setPositions] = useState<Position[]>([]);
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);

  // 计算最大可用仓位 / Calculate maximum available position
  const calculateMaxPosition = (capital: number, leverage: number) => {
    return capital * leverage;
  };

  // 计算爆仓价格 / Calculate liquidation price
  const calculateLiquidationPrice = (initialPrice: number, direction: 'long' | 'short', leverage: number) => {
    if (direction === 'long') {
      return initialPrice * (1 - 1 / leverage);
    } else {
      return initialPrice * (1 + 1 / leverage);
    }
  };

  // 生成仓位表格数据 / Generate position table data
  const generatePositions = (values: CalculatorForm) => {
    const { totalCapital, leverage, initialPrice, direction, additionalPositions, additionalPositionAmount } = values;
    const maxPosition = calculateMaxPosition(totalCapital, leverage);
    const positions: Position[] = [];

    // 添加初始仓位 / Add initial position
    positions.push({
      key: 1,
      price: initialPrice,
      amount: maxPosition / initialPrice,
      totalValue: maxPosition,
      pnl: 0
    });

    // 添加补仓仓位 / Add additional positions
    for (let i = 1; i <= additionalPositions; i++) {
      const price = direction === 'long' 
        ? initialPrice * (1 + i * 0.05) // 上涨5% / Increase by 5%
        : initialPrice * (1 - i * 0.05); // 下跌5% / Decrease by 5%
      
      const amount = (additionalPositionAmount * maxPosition) / price;
      positions.push({
        key: i + 1,
        price,
        amount,
        totalValue: amount * price,
        pnl: 0
      });
    }

    setPositions(positions);
  };

  const onFinish = (values: CalculatorForm) => {
    generatePositions(values);
    setLiquidationPrice(calculateLiquidationPrice(
      values.initialPrice,
      values.direction,
      values.leverage
    ));
  };

  const columns = [
    {
      title: '仓位序号 / Position No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '价格 / Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '数量 / Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toFixed(4),
    },
    {
      title: '总价值 / Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (value: number) => `$${value.toFixed(2)}`,
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>
        <CalculatorOutlined /> 交易计算器 / Trading Calculator
      </Title>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            leverage: 3,
            additionalPositions: 3,
            additionalPositionAmount: 0.5,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              label="当前总资金（USDT）/ Total Capital (USDT)"
              name="totalCapital"
              rules={[{ required: true, message: '请输入总资金 / Please input total capital' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              label="杠杆倍数 / Leverage"
              name="leverage"
              rules={[{ required: true, message: '请输入杠杆倍数 / Please input leverage' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="初始开仓价格 / Initial Entry Price"
              name="initialPrice"
              rules={[{ required: true, message: '请输入开仓价格 / Please input entry price' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              label="开仓方向 / Position Direction"
              name="direction"
              rules={[{ required: true, message: '请选择开仓方向 / Please select position direction' }]}
            >
              <Select>
                <Option value="long">做多 / Long</Option>
                <Option value="short">做空 / Short</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="计划补仓次数 / Additional Positions"
              name="additionalPositions"
              rules={[{ required: true, message: '请输入补仓次数 / Please input number of additional positions' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="每次补仓金额比例 / Additional Position Ratio"
              name="additionalPositionAmount"
              rules={[{ required: true, message: '请输入补仓比例 / Please input additional position ratio' }]}
            >
              <Input type="number" step="0.1" />
            </Form.Item>

            <Form.Item
              label="最大允许亏损金额 / Maximum Loss"
              name="maxLoss"
              rules={[{ required: true, message: '请输入最大亏损金额 / Please input maximum loss' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<CalculatorOutlined />}>
                计算 / Calculate
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {positions.length > 0 && (
        <>
          <Divider />
          <Card>
            <Title level={4}>
              <LineChartOutlined /> 仓位监控表格 / Position Monitoring Table
            </Title>
            <Table columns={columns} dataSource={positions} pagination={false} />
          </Card>

          <Card style={{ marginTop: '16px' }}>
            <Title level={4}>
              <WarningOutlined /> 风险提示 / Risk Warning
            </Title>
            <p>预估爆仓价格 / Estimated Liquidation Price: ${liquidationPrice.toFixed(2)}</p>
            <p>最大可用仓位 / Maximum Available Position: ${(form.getFieldValue('totalCapital') * form.getFieldValue('leverage')).toFixed(2)}</p>
          </Card>
        </>
      )}
    </div>
  );
};

export default TradingCalculator; 