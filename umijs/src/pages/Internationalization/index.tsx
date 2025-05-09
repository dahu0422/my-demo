import formatCurrency from '@/utils/formatCurrency';
import { useIntl } from '@umijs/max';
import { Card, Space, Typography } from 'antd';

const { Text, Title } = Typography;

const IntlDemo = () => {
  const intl = useIntl();

  // 1. 基础文本格式化
  const welcomeMessage = intl.formatMessage(
    { id: 'welcome' },
    { name: '张三' },
  );

  // 2. 数字格式化
  const userCount = intl.formatMessage({ id: 'user.count' }, { count: 4523 });

  // 3. 货币格式化
  const price = formatCurrency(299.99);

  // 4. 日期格式化
  const now = new Date();
  const formattedDate = intl.formatDate(now, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 5. 时间格式化
  const formattedTime = intl.formatTime(now, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <Card title="useIntl 格式化示例">
      <Space direction="vertical" size="middle">
        <div>
          <Title level={5}>1. 基础文本插值</Title>
          <Text>{welcomeMessage}</Text>
        </div>

        <div>
          <Title level={5}>2. 消息中的数字格式化</Title>
          <Text>{userCount}</Text>
        </div>

        <div>
          <Title level={5}>3. 货币格式化 (formatNumber)</Title>
          <Text>直接格式化: {price}</Text>
          <br />
          <Text>
            通过消息格式化:{' '}
            {intl.formatMessage({ id: 'price' }, { price: 299.99 })}
          </Text>
        </div>

        <div>
          <Title level={5}>4. 日期格式化 (formatDate)</Title>
          <Text>直接格式化: {formattedDate}</Text>
          <br />
          <Text>
            通过消息格式化:{' '}
            {intl.formatMessage({ id: 'date.birthday' }, { date: now })}
          </Text>
        </div>

        <div>
          <Title level={5}>5. 时间格式化 (formatTime)</Title>
          <Text>直接格式化: {formattedTime}</Text>
          <br />
          <Text>
            通过消息格式化:{' '}
            {intl.formatMessage({ id: 'time.current' }, { time: now })}
          </Text>
        </div>

        <div>
          <Title level={5}>6. 复数</Title>
          <Text>
            {intl.formatMessage({ id: 'messageCount' }, { count: 0 })}
          </Text>
          <br />
          <Text>
            {intl.formatMessage({ id: 'messageCount' }, { count: 1 })}
          </Text>
          <br />
          <Text>
            {intl.formatMessage({ id: 'messageCount' }, { count: 2 })}
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default IntlDemo;
