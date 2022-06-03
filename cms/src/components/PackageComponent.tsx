import React from 'react';
import { PACKAGE } from '@/utils/constants';
import { useIntl } from 'umi';

interface PackageProps {
  packageType?: string;
}

const PackageType: React.FC<PackageProps> = props => {
  const { formatMessage } = useIntl();
  const { packageType } = props;
  if (!packageType) return null;

  switch (packageType) {
    case 'premium':
      return (
        <p
          style={{
            background: '#753FE7',
            borderRadius: 6,
            textAlign: 'center',
            margin: 0,
            color: 'white',
            width: 80,
            fontWeight: 600,
          }}
        >
          {formatMessage({ id: `package.${packageType}` })}
        </p>
      );
    case 'advance':
      return (
        <p
          style={{
            background: '#286CEF',
            borderRadius: 6,
            textAlign: 'center',
            margin: 0,
            color: 'white',
            width: 80,
            fontWeight: 600,
          }}
        >
          {formatMessage({ id: `package.${packageType}` })}
        </p>
      );
    case 'standard':
      return (
        <p
          style={{
            background: '#1AB46A',
            borderRadius: 6,
            textAlign: 'center',
            margin: 0,
            color: 'white',
            width: 80,
            fontWeight: 600,
          }}
        >
          {formatMessage({ id: `package.${packageType}` })}
        </p>
      );
    case 'basic':
      return (
        <p
          style={{
            background: '#D2D2D2',
            borderRadius: 6,
            textAlign: 'center',
            margin: 0,
            color: 'white',
            width: 80,
            fontWeight: 600,
          }}
        >
          {formatMessage({ id: `package.${packageType}` })}
        </p>
      );
    default:
      return (
        <p
          style={{
            background: '#a6a6a6',
            borderRadius: 6,
            textAlign: 'center',
            margin: 0,
            color: 'white',
            width: 80,
            fontWeight: 600,
          }}
        >
          {formatMessage({ id: 'package.defaultPackageName' })}
        </p>
      );
  }
};

export default PackageType;
