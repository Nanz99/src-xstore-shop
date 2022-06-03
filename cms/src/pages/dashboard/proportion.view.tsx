import { Card, Empty, Radio } from 'antd'
import { connect, getLocale } from 'umi'
import { FormattedMessage, useIntl, Dispatch } from 'umi'
import { RadioChangeEvent } from 'antd/es/radio'
import React, { useMemo } from 'react'
import { VisitDataItem } from '@/models/dashboard.model'
import { Pie } from '../../components/Charts'
import styles from './styles.less'
import { ShoppingFilled } from '@ant-design/icons'

const ProportionSales = ({
  loading,
  dispatch,
  totalData
}: {
  dispatch: Dispatch,
  totalData: any
  loading: boolean
  dropdownGroup: React.ReactNode
  salesType: 'all' | 'online' | 'stores'
  salesPieData: VisitDataItem[]
  handleChangeSalesType?: (e: RadioChangeEvent) => void
}) => {
  const { formatMessage } = useIntl()
  const locale = getLocale()
  useMemo(() => {
    dispatch({ type: 'dashboard/getTotalDataModel' })
  }, [])


  const orderData = [
    {
      x: locale === 'vi-VN' ? 'Mới' : 'New',
      y: totalData?.totalOrderNew || 0,
    },
    {
      x: locale === 'vi-VN' ? 'Đang xử lý' : 'Processing',
      y: totalData?.totalOrderProcessing || 0, 
    },
    {
      x: locale === 'vi-VN' ? 'Đang giao' : 'Delivering',
      y: totalData?.totalOrderDelivering || 0,
    },
    {
      x: locale === 'vi-VN' ? 'Hoàn thành' : 'Done',
      y: totalData?.totalOrderDone || 0,
    },
    {
      x: locale === 'vi-VN' ? 'Từ chối' : 'Rejected',
      y: totalData?.totalOrderReject || 0,
    },
  ]



  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={
        <FormattedMessage
          id="dashboard.the-proportion-of-order"
          defaultMessage="The Proportion of Order"
        />
      }
      style={{
        height: '100%',
        borderRadius: '1rem',
        boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)'
      }}
    >
      <div>
        {/* <h4 style={{ marginTop: 8, marginBottom: 32 }}>
          <FormattedMessage id="dashboard.order" defaultMessage="Order" />
        </h4> */}
        {orderData && orderData?.length > 0 ? ( <Pie
          hasLegend
          subTitle={
            <FormattedMessage id="dashboard.order" defaultMessage="Order" />
          }
          total={() => {
            ; `${orderData.reduce((pre, now) => now.y + pre, 0)}VND`
          }}
          data={orderData}
          valueFormat={value => <div>{value}&nbsp;<ShoppingFilled style={{marginLeft: '5px'}} /></div>}
          height={248}
          lineWidth={4}
        />) : ( <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
      
      </div>
    </Card>
  )
}


export default connect(
  ({
    dashboard,
    loading,

  }: {

    dashboard: any,
    loading: {
      effects: { [key: string]: boolean }
    }
  }) => ({
    dashboard,
    loading: loading.effects['dashboard/getTotalDataModel'],
    totalData: dashboard.totalData
  }),
)(ProportionSales)