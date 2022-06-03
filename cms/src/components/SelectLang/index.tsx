import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { getLocale, setLocale } from 'umi';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';
import classNames from 'classnames';
import { ClickParam } from 'antd/es/menu';
import styles from './index.less';

interface SelectLangProps {
  className?: string;
}

const SelectLang: React.FC<SelectLangProps> = props => {
  const { className } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }: ClickParam): void => setLocale(key);

  const locales = ['vi-VN', 'en-US'];
  const languageLabels: any = {
    'vi-VN': 'Tiếng Việt',
    'en-US': 'English',
  };
  const languageIcons: any = {
    'vi-VN': '/flags/vietnam.svg',
    'en-US': '/flags/united-kingdom.svg',
  };

  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[selectedLang]}
      onClick={changeLang}
    >
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            <img src={languageIcons[locale]} width={20} />
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <GlobalOutlined title="Language" />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
