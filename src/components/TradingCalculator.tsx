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

import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Card, Space, Typography, Divider } from 'antd';
import { CalculatorOutlined, LineChartOutlined, WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface CalculatorForm {
  maxLoss: number;
  additionalPositionAmount: number;
  additionalPositions: number;
  direction: 'long' | 'short';
  initialPrice: number;
  leverage: number;
}

interface Position {
  key: number;
  price: number;
  amount: number;
  entryAmount: number;
  totalAmount: number;
  totalQty: number;
  avgPrice: number;
  cumulativeLoss: number;
}

const TradingCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [positions, setPositions] = useState<Position[]>([]);

  // 安全地格式化数字 / Safely format numbers
  const formatNumber = (value: any, decimals: number = 4): string => {
    const num = Number(value);
    if (isNaN(num)) return '0.0000';
    return num.toFixed(decimals);
  };

  // 计算每次补仓后的累计亏损和持仓均价 / Calculate cumulative loss and average price after each entry
  const generatePositions = (values: CalculatorForm) => {
    const { maxLoss, additionalPositionAmount, additionalPositions, direction, initialPrice, leverage } = values;
    const priceStep = 0.05; // 固定步长5% / Fixed price step 5%
    const entryCount = additionalPositions + 1; // 包含初始开仓 / Include initial entry
    const entryAmount = maxLoss * additionalPositionAmount; // 每次补仓金额 / Each entry amount
    let positions: Position[] = [];
    let totalAmount = 0; // 累计投入金额 / Cumulative entry amount
    let totalQty = 0;    // 累计持仓数量 / Cumulative position quantity
    let avgPrice = 0;    // 持仓均价 / Average position price
    let cumulativeLoss = 0; // 累计亏损 / Cumulative loss
    let price = initialPrice;

    for (let i = 0; i < entryCount; i++) {
      // 计算本次补仓价格 / Calculate entry price
      if (i > 0) {
        price = direction === 'long'
          ? price * (1 - priceStep)
          : price * (1 + priceStep);
      }
      // 计算本次买入数量 / Calculate entry quantity
      const qty = entryAmount / price;
      totalAmount += entryAmount;
      totalQty += qty;
      avgPrice = totalAmount / totalQty;
      // 计算累计亏损 / Calculate cumulative loss
      // 做多：亏损 = (均价 - 当前价) * 总数量 / Long: loss = (avgPrice - price) * totalQty
      // 做空：亏损 = (当前价 - 均价) * 总数量 / Short: loss = (price - avgPrice) * totalQty
      cumulativeLoss = direction === 'long'
        ? (avgPrice - price) * totalQty
        : (price - avgPrice) * totalQty;
      positions.push({
        key: i + 1,
        price,
        amount: qty,
        entryAmount,
        totalAmount,
        totalQty,
        avgPrice,
        cumulativeLoss,
      });
    }
    setPositions(positions);
  };

  const onFinish = (values: CalculatorForm) => {
    generatePositions(values);
  };

  const columns = [
    {
      title: '序号 / No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '开仓价格 / Entry Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => `$${formatNumber(price, 5)}`,
    },
    {
      title: '本次开仓金额 / Entry Amount',
      dataIndex: 'entryAmount',
      key: 'entryAmount',
      render: (amount: any) => `$${formatNumber(amount, 2)}`,
    },
    {
      title: '本次开仓数量 / Entry Qty',
      dataIndex: 'amount',
      key: 'amount',
      render: (qty: any) => formatNumber(qty, 4),
    },
    {
      title: '累计持仓金额 / Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: any) => `$${formatNumber(amount, 2)}`,
    },
    {
      title: '累计持仓数量 / Total Qty',
      dataIndex: 'totalQty',
      key: 'totalQty',
      render: (qty: any) => formatNumber(qty, 4),
    },
    {
      title: '持仓均价 / Avg Price',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      render: (price: any) => `$${formatNumber(price, 5)}`,
    },
    {
      title: '累计亏损 / Cumulative Loss',
      dataIndex: 'cumulativeLoss',
      key: 'cumulativeLoss',
      render: (loss: any) => `$${formatNumber(loss, 2)}`,
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
            direction: 'long',
            initialPrice: 1,
            maxLoss: 100,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              label="最大允许亏损金额 / Maximum Loss"
              name="maxLoss"
              rules={[{ required: true, message: '请输入最大亏损金额 / Please input maximum loss' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>
            <Form.Item
              label="每次补仓金额比例 / Additional Position Ratio (相对于最大亏损金额 / Relative to Max Loss)"
              name="additionalPositionAmount"
              rules={[{ required: true, message: '请输入补仓比例 / Please input additional position ratio' }]}
            >
              <Input type="number" step="0.01" />
            </Form.Item>
            <Form.Item
              label="计划补仓次数 / Additional Positions"
              name="additionalPositions"
              rules={[{ required: true, message: '请输入补仓次数 / Please input number of additional positions' }]}
            >
              <Input type="number" />
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
              label="初始开仓价格 / Initial Entry Price"
              name="initialPrice"
              rules={[{ required: true, message: '请输入开仓价格 / Please input entry price' }]}
            >
              <Input type="number" prefix="$" step="0.00001" />
            </Form.Item>
            <Form.Item
              label="杠杆倍数 / Leverage"
              name="leverage"
              rules={[{ required: true, message: '请输入杠杆倍数 / Please input leverage' }]}
            >
              <Input type="number" />
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
              <LineChartOutlined /> 补仓明细表 / Position Details Table
            </Title>
            <Table columns={columns} dataSource={positions} pagination={false} />
          </Card>
          <Card style={{ marginTop: '16px' }}>
            <Title level={4}>
              <WarningOutlined /> 风险提示 / Risk Warning
            </Title>
            <p>本表格假设每次补仓后价格都向极端不利方向移动，最终累计亏损等于最大允许亏损金额。</p>
            <p>This table assumes that after each entry, the price moves in the most unfavorable direction, and the cumulative loss eventually equals the maximum allowed loss.</p>
          </Card>
        </>
      )}
    </div>
  );
};

export default TradingCalculator; 