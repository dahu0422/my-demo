import { ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';

const AccountForm: React.FC = () => {
  return (
    <>
      <ProFormText
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
        placeholder="请输入用户名"
      />
      <ProFormText.Password
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
        placeholder="请输入密码"
      />
      <ProFormCaptcha
        name="captcha"
        label="验证码"
        rules={[{ required: true, message: '请输入验证码' }]}
        placeholder="请输入验证码"
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count}秒后重新获取`;
          }
          return (
            <div>
              <img src="" alt="" />
            </div>
          );
        }}
        onGetCaptcha={async () => {
          message.success('获取验证码成功！验证码为：1234');
        }}
      />
    </>
  );
};

export default AccountForm;
