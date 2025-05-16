import { ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';

const FeishuAccountForm: React.FC = () => {
  return (
    <>
      <ProFormText name="username" label="工号" />
      <ProFormCaptcha
        name="captcha"
        label="验证码"
        rules={[{ required: true, message: '请输入验证码' }]}
        placeholder="请输入验证码"
        onGetCaptcha={async () => {
          message.success('获取验证码成功！验证码为：1234');
        }}
      />
    </>
  );
};

export default FeishuAccountForm;
