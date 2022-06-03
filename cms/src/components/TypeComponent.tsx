import React from 'react';
import { UserType } from '@/utils/constants';
import { Tag } from 'antd';
import { useIntl } from 'umi';

interface StatusProps {
  type?: number;
}

const TypeComponent: React.FC<StatusProps> = props => {
  const { type } = props;
  const { formatMessage } = useIntl();
  if (!type) return null;

  switch (type) {
    case 0:
      return (
        <Tag style={{ margin: 0 }} color="blue">
          {formatMessage({ id: `common.type.${UserType[type]}` })}
        </Tag>
      );
    case 1:
      return (
        <Tag style={{ margin: 0 }} color="#ff9900">
          {formatMessage({ id: `common.type.${UserType[type]}` })}
        </Tag>
      );
    default:
      return null;
  }
};

export default TypeComponent;
