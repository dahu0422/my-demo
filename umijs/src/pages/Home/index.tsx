import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const intl = useIntl();
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        {intl.formatMessage({ id: 'menu.home' })}
      </div>
    </PageContainer>
  );
};

export default HomePage;
