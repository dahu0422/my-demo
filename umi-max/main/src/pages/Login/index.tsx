import { LoginForm } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';
import AccountForm from './AccountForm';
import FeishuAccountForm from './FeishuAccountForm';
import styles from './index.module.less';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<'pwd' | 'feishu'>('pwd');

  // 登录逻辑
  const handleSubmit = async (values: any, type: string) => {
    if (type === 'pwd') {
      // TODO:账户密码登录
    } else {
      // TODO:飞书登录
    }
  };

  // 切换登录按钮
  const switchLoginTypeButton = () => {
    return (
      <Button
        style={{ width: '100%' }}
        onClick={() => setLoginType(loginType === 'pwd' ? 'feishu' : 'pwd')}
      >
        {loginType === 'pwd' ? '飞书登录' : '密码登录'}
      </Button>
    );
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-header']}>TestDemo</div>
      <div className={styles['login-content']}>
        <LoginForm
          actions={switchLoginTypeButton()}
          onFinish={async (values) => {
            await handleSubmit(values, loginType);
          }}
        >
          {loginType === 'pwd' ? <AccountForm /> : <FeishuAccountForm />}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
