import { Card, Col, DatePicker, Row, Tabs } from 'antd'
import { FormattedMessage, formatMessage } from 'umi'
import { RangePickerProps } from 'antd/es/date-picker/generatePicker'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import numeral from 'numeral'
import { VisitDataItem } from '@/models/dashboard.model'
import { Bar } from '../../components/Charts'
import styles from './styles.less'
import { connect } from 'umi'
import { ConnectState } from '@/models/connect';
import _ from 'lodash';
import { getTimeDistance } from '@/utils/utils'
import { Empty } from 'antd';

const { RangePicker } = DatePicker
const { TabPane } = Tabs

const rankingListData: { title: string; total: number }[] = []
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'dashboard.test' }, { no: i }),
    total: 323234,
  })
}

type RangePickerValue = RangePickerProps<moment.Moment>['value']

const SalesCard = props => {
  const {
    loading,
    dispatch,
    listBestSelling
  } = props
  const [params, setParams] = useState(getTimeDistance('month'))
  const dataRevenue = {
    startDate: params?.[0].format('YYYY-MM-DD[T]HH:mm:ss'),
    endDate: params?.[1].format('YYYY-MM-DD[T]HH:mm:ss')
  }

  useMemo(() => {
    dispatch({ type: 'dashboard/getBestSelling', payload: dataRevenue })
  }, [params])

  const listBestSellingArr = _.values(listBestSelling)?.filter(item => item !== true)?.slice(0, 10)?.sort((a, b) => a?.product?.id - b?.product?.id)?.map(item => ({ y: Number(item.sum), x: item.product.name }))
  // const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('month'))
  // const [revenue, setRevenue] = useState(0)




  const isActive = (type: 'today' | 'week' | 'month' | 'year') => {

    if (!params) {
      return ''
    }
    const value = getTimeDistance(type)
    if (!value) {
      return ''
    }
    if (!params[0] || !params[1]) {
      return ''
    }
    if (
      params[0].isSame(value[0] as moment.Moment, 'day') &&
      params[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate
    }
    return ''
  }

  const handleRangePickerChange = async (rangePickerValue: RangePickerValue) => {
    setParams(rangePickerValue)
  }
  const selectDate = async (type: 'today' | 'week' | 'month' | 'year') => {
    setParams(getTimeDistance(type))
  }


  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: '1rem', boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)' }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
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
                value={params}
                onChange={handleRangePickerChange}
                style={{ width: 330 }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={
              <FormattedMessage id="dashboard.sales" defaultMessage="Sales" />
            }
            key="sales"
          >
            {listBestSellingArr && listBestSellingArr.length > 0 ? (
              <Row>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesBar}>
                    <Bar
                      height={295}
                      title={
                        <FormattedMessage
                          id="dashboard.sales-trend-best"
                          defaultMessage="Sales Trend"
                        />
                      }
                      data={listBestSellingArr}
                    />
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesRank}>
                    <h4 className={styles.rankingTitle}>
                      <FormattedMessage
                        id="dashboard.sales-ranking"
                        defaultMessage="Sales Ranking"
                      />
                    </h4>
                    <ul className={styles.rankingList}>
                      {_.values(listBestSelling)?.filter(item => item !== true)?.slice(0, 7)?.map((item, i) => (
                        <li key={item.title}>
                          <span
                            className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''
                              }`}
                          >
                            {i + 1}
                          </span>
                          <span
                            className={styles.rankingItemTitle}
                            title={item.title}
                            style={{ textTransform: 'capitalize', fontWeight: 500, color: '#3d405b', }}
                          >
                            {item?.product?.name}
                          </span>
                          <span className={styles.rankingItemValue} style={{ textTransform: 'capitalize', fontWeight: 500, color: '#3d405b', }}>
                            {numeral(item.sum).format('0,0')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row> ) : ( <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
          </TabPane>
          {/* <TabPane
            tab={
              <FormattedMessage id="dashboard.visits" defaultMessage="Visits" />
            }
            key="views"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    height={292}
                    title={
                      <FormattedMessage
                        id="dashboard.visits-trend"
                        defaultMessage="Visits Trend"
                      />
                    }
                    data={salesData}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="dashboard.visits-ranking"
                      defaultMessage="Visits Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {rankingListData.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${
                            i < 3 ? styles.active : ''
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={styles.rankingItemTitle}
                          title={item.title}
                        >
                          {item.title}
                        </span>
                        <span>{numeral(item.total).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane> */}
        </Tabs>
      </div>
    </Card>
  )
}

export default connect(
  ({ dashboard, loading }: ConnectState) => ({
    loading: loading.effects['dashboard/getBestSelling'],
    listBestSelling: dashboard?.listBestSelling || [],
  }),
)(SalesCard)