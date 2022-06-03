import React from 'react';
import { UserRole } from '@/utils/constants';
import { Tag } from 'antd';
import { useIntl } from 'umi';

interface StatusProps {
  role?: string;
}

const RoleComponent: React.FC<StatusProps> = props => {
  const { role } = props;
  const { formatMessage } = useIntl();
  if (!role) return null;

  switch (role) {
    case 'AUTHORED_USER':
      return (
        <Tag style={{ margin: 0 }} color="#339966">
          {formatMessage({ id: `common.role.${UserRole[0]}` })}
        </Tag>
      );
    case 'CUSTOMER':
      return (
        <Tag style={{ margin: 0 }} color="#00ccff">
          {formatMessage({ id: `common.role.${UserRole[1]}` })}
        </Tag>
      );
    case 'PROVIDER':
      return (
        <Tag style={{ margin: 0 }} color="#3366cc">
          {formatMessage({ id: `common.role.${UserRole[2]}` })}
        </Tag>
      );
    case 'VERIFIER':
      return (
        <Tag style={{ margin: 0 }} color="#009933">
          {formatMessage({ id: `common.role.${UserRole[3]}` })}
        </Tag>
      );
    case 'OPERATOR':
      return (
        <Tag style={{ margin: 0 }} color="#ff751a">
          {formatMessage({ id: `common.role.${UserRole[4]}` })}
        </Tag>
      );
    case 'ADMIN':
      return (
        <Tag style={{ margin: 0 }} color="#00ccff">
          {formatMessage({ id: `common.role.${UserRole[5]}` })}
        </Tag>
      );
    default:
      return null;
  }
};

export default RoleComponent;
