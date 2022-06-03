import { AppstoreFilled, BookFilled, DollarCircleFilled, DollarCircleOutlined, InfoCircleOutlined, ShoppingFilled, TagsFilled, UserAddOutlined } from '@ant-design/icons'
import { Card, Col, Row, DatePicker } from 'antd'

import { useIntl, connect, Dispatch, FormattedMessage, Link } from 'umi'
import React, { useEffect, useMemo, useState } from 'react'
import numeral from 'numeral'
import { VisitDataItem } from '@/models/dashboard.model'
import styles from './styles.less'
import { ConnectState } from '@/models/connect';
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker'
import { getTimeDistance } from '@/utils/utils'
import { caculateDiscount, caculateRevene, caculateUserNew} from '@/services/dashboard.service'


const { RangePicker } = DatePicker
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
}

interface IntroduceRowProps {
  loading: boolean,
  visitData,
  totalData: {},
  dispatch: Dispatch,
  totalRevenue: number,
  totalDiscount: number
}

type RangePickerValue = RangePickerProps<moment.Moment>['value']

const IntroduceRow: React.FC<IntroduceRowProps> = ({
  visitData,
  totalData,
  dispatch,
  totalRevenue,
  totalDiscount,
  loading,
}: {
  loading: boolean
  visitData: VisitDataItem[],
  totalDiscount: number,
  totalRevenue: number,
  dispatch: Dispatch,
  totalData: {}
}) => {

  const { formatMessage } = useIntl()

  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('month'))
  const [revenue, setRevenue] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [userNew, setUserNew] = useState(0)

  // const dataRevenue = {
  //   startDate: rangePickerValue?.[0].toISOString(),
  //   endDate: rangePickerValue?.[1].toISOString()
  // }
  const dataRevenue = {
    startDate: rangePickerValue?.[0].format('YYYY-MM-DD[T]HH:mm:ss'),
    endDate: rangePickerValue?.[1].format('YYYY-MM-DD[T]HH:mm:ss')
  }

  const fetch = () => {
    dispatch({
      type: 'dashboard/getTotalDataModel',
    })
  }
  useMemo(() => {
    fetch()
  }, [])


  const isActive = (type: 'today' | 'week' | 'month' | 'year') => {

    if (!rangePickerValue) {
      return ''
    }
    const value = getTimeDistance(type)
    if (!value) {
      return ''
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate
    }
    return ''
  }

  const handleRangePickerChange = async (rangePickerValue: RangePickerValue) => {
    setRangePickerValue(rangePickerValue)
  }
  const selectDate = async (type: 'today' | 'week' | 'month' | 'year') => {
    setRangePickerValue(getTimeDistance(type))
  }
  useMemo(async () => {
    const res = await caculateRevene(dataRevenue)
    if (res?.success) {
      setRevenue(res.revenue)
    }
    const _res = await caculateUserNew(dataRevenue)
    if (_res?.success) {
      setUserNew(_res.totalUserNew)
    }
  }, [rangePickerValue])




  return (
    <div>
      <Row gutter={24} type="flex">
        <Col span={24} style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <div className={styles.salesExtraWrap}  >
            <div className={styles.salesExtra}>
              <a
                className={() => isActive('today')}
                onClick={() => selectDate('today')}
              >
                <FormattedMessage
                  id="dashboard.all-day"
                  defaultMessage="All Day"
                />
              </a>
              <a
                className={() => isActive('week')}
                onClick={() => selectDate('week')}
              >
                <FormattedMessage
                  id="dashboard.all-week"
                  defaultMessage="All Week"
                />
              </a>
              <a
                className={() => isActive('month')}
                onClick={() => selectDate('month')}
              >
                <FormattedMessage
                  id="dashboard.all-month"
                  defaultMessage="All Month"
                />
              </a>
              <a
                className={() => isActive('year')}
                onClick={() => selectDate('year')}
              >
                <FormattedMessage
                  id="dashboard.all-year"
                  defaultMessage="All Year"
                />
              </a>
            </div>
            <RangePicker
              showTime
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{ width: 330 }}
            />
          </div>
        </Col>
      </Row>
      <Row gutter={24} type="flex">
        <Col {...topColResponsiveProps}>
          <Card loading={loading} style={{ borderRadius: '1rem', boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)', background: 'linear-gradient(to right, #5d24d4, #3165f4)' }}>
            <div className={styles.card__container}>
              <div className={styles.card__left}>
                <h3 className={styles.card__count}>{totalData?.totalProduct || 0}</h3>
                <p className={styles.card__title}>{formatMessage({ id: 'dashboard.totalProduct' })}</p>
              </div>
              <div>
                <BookFilled className='iconClass' />
              </div>
            </div>
          </Card>
        </Col>
        <Col {...topColResponsiveProps}>
          <Card loading={loading} style={{ borderRadius: '1rem', boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)', background: 'linear-gradient(to right, #f12711, #f5af19)' }}>
            <div className={styles.card__container}>
              <div className={styles.card__left}>
                <h3 className={styles.card__count}>{totalData?.totalOrder || 0}</h3>
                <p className={styles.card__title}>{formatMessage({ id: 'dashboard.totalOrder' })}</p>
              </div>
              <div>

                <ShoppingFilled className='iconClass' />
              </div>
            </div>
          </Card>
        </Col>
        <Col {...topColResponsiveProps}>
          <Card loading={loading} style={{ borderRadius: '1rem', boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)', background: 'linear-gradient(to right, #09b18b, #79c44f)' }}>
            <div className={styles.card__container}>
              <div className={styles.card__left}>
                <h3 className={styles.card__count}>{numeral(revenue).format(0, 0) || 0} đ</h3>
                <p className={styles.card__title}>{formatMessage({ id: 'dashboard.totalRevenue' })}</p>
              </div>
              <div>
                <DollarCircleFilled className='iconClass' />
              </div>
            </div>
          </Card>
        </Col>
        <Col {...topColResponsiveProps}>
          <Card loading={loading} style={{ borderRadius: '1rem', boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)', background: 'linear-gradient(to right, #f11962, #fc5717)' }}>
            <div className={styles.card__container}>
              <div className={styles.card__left}>
                <h3 className={styles.card__count}>{numeral(userNew).format(0, 0) || 0}</h3>
                <p className={styles.card__title}>{formatMessage({ id: 'dashboard.user' })}</p>
              </div>
              <div>
                <UserAddOutlined className='iconClass' />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}


export default connect(
  ({ loading, dashboard }: ConnectState) => ({
    loading: loading.effects['dashboard/getTotalDataModel'],
    totalData: dashboard?.totalData,
  }),
)(IntroduceRow)