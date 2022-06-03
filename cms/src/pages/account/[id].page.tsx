import { getDetailAccount } from '@/services/account.service'
import { getCustomerOrder } from '@/services/account.service'
import { convertDateToInt, formatDate } from '@/utils/utils'
import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  IdcardOutlined,
  CalendarOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Tabs,
  Tag,
  Typography,
  Table,
  Descriptions,
} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { OrderItem } from '@/models/order.model'
import { ContactsOutlined } from '@ant-design/icons'
import React, { useEffect, useMemo, useState } from 'react'
import { useIntl, useParams, Dispatch, history } from 'umi'
import styles from './style.less'
import numeral from 'numeral'

const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs

interface OrderProps {
  listOrder?: OrderItem[]
  total: number
  loading: boolean
  dispatch: Dispatch
}

const DetailAccount: React.FC<OrderProps> = props => {
  const { id } = useParams()
  const { formatMessage } = useIntl()
  const [data, setData] = useState({})
  const [customerOrder, setCustomerOrder] = useState({})
  const { loading } = props
  const [limit, setLimit] = useState(5)
  const [page, setPage] = useState(1)
  const [showCustomerForm, setShowCustomerForm] = useState('none')
  const [showAdminForm, setShowAdminForm] = useState('none')

  const formatStatusToString = values => {
    switch (values) {
      case 0:
        return <Tag color="red">Deactive</Tag>
        break
      case 1:
        return <Tag color="green">Active</Tag>
        break
      default:
        return <Tag color="white">No Tag</Tag>
        break
    }
  }

  const onTableChange = (pageSize: number) => {
    if (page !== pageSize) {
      setPage(pageSize)
    }
  }

  const onShowSizeChange = (current: number, size: number) => {
    if (limit !== size) {
      setLimit(size)
    }
  }

  const handleShowCustomerForm = data => {
    if (data.role == 'CUSTOMER') {
      setShowCustomerForm('unset')
      setShowAdminForm('none')
    } else {
      setShowCustomerForm('none')
      setShowAdminForm('unset')
    }
  }

  const fetch = async () => {
    const res = await getDetailAccount(id)
    if (res) {
      setData(res)
      handleShowCustomerForm(res)
    } else {
    }
  }

  const fetchCustomerOrder = async () => {
    const res = await getCustomerOrder(id)
    if (res) {
      setCustomerOrder(res)
    } else {
    }
  }

  useMemo(() => {
    fetch()
    fetchCustomerOrder()
  }, [id])

  const columns: ColumnProps<OrderItem>[] = [
    {
      title: formatMessage({ id: 'order.index' }),
      render: (v, t, i) => (page - 1) * limit + i + 1,
    },
    {
      title: formatMessage({ id: 'order.order' }),
      render: value => {
       
        return (
          <div>
            <div>
              <a
                onClick={() => {
                  history.push(
                    `/orders/${value.id}?status=${value.orderStatus}`,
                  )
                }}
              >
                ID: #{value.id}
              </a>
            </div>
            <div>
              {value.orderStatus === 0 ? (
                <Tag color="blue"> {formatMessage({ id: 'order.statusNEW' })} </Tag>
              ) : value.orderStatus === 1 ? (
                <Tag color="gold">
                {' '}
                {formatMessage({ id: 'order.statusPROCESSING' })}{' '}
              </Tag>
              ) : value.orderStatus === 2 ? (
                <Tag color="lime">
                {formatMessage({ id: 'order.statusDELIVERING' })}{' '}
             </Tag>
              ) : value.orderStatus === 3 ? (
                <Tag color="green"> {formatMessage({ id: 'order.statusDONE' })} </Tag>
              ) : (
                <Tag color="red"> {formatMessage({ id: 'order.statusREJECT' })} </Tag>
              )}
            </div>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.price' }),
      render: value => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'order.shipPrice' })}:{' '}
              {value && value.shippingFee ? (
                <Tag color="geekblue">
                  {numeral(value.shippingFee).format(0, 0) || ''} đ
                </Tag>
              ) : (
                <Tag color="geekblue">Free</Tag>
              )}
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'order.salePrice' })}:{' '}
              <Tag color="geekblue">
                {numeral(value.grandTotal).format(0, 0) || ''} đ
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.date' }),
      render(value) {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'order.detailCreateAt' })}:{' '}
              <Tag color="magenta">{formatDate(value.createdAt) || ''}</Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'order.detailUpdateAt' })}:{' '}
              <Tag color="magenta">{formatDate(value.updatedAt) || ''}</Tag>
            </Paragraph>
          </div>
        )
      },
    },
    // {
    //   title: formatMessage({ id: 'order.stockoutStatus' }),
    //   render(value) {
    //     return (
    //       <div>
    //         {value.stockoutStatus === 0 ? (
    //           <Tag color="#ff5500">
    //             {formatMessage({ id: 'order.statusIncomplete' })}
    //           </Tag>
    //         ) : value.stockoutStatus === 1 ? (
    //           <Tag color="#0070B8">
    //             {formatMessage({ id: 'order.statusCompleted' })}
    //           </Tag>
    //         ) : (
    //           ''
    //         )}
    //       </div>
    //     )
    //   },
    // },
    {
      title: formatMessage({ id: 'stockout.action' }),
      render(value) {
        return (
          <div>
            <Button
              onClick={() => {
                history.push(`/orders/${value.id}?status=${value.orderStatus}`)
              }}
            >
              {formatMessage({ id: 'order.viewDetail' })}
            </Button>
          </div>
        )
      },
    },
  ]

 
  return (
    <>
      <PageHeaderWrapper>
        <Affix offsetTop={0}>
          {/* <Card>
            <Tag color="#108ee9" style={{ fontSize: 14, padding: 4 }}>
              {formatMessage({ id: 'account.status' })}
            </Tag>

            {typeof data.status === 'number'
              ? (<Radio.Group
                optionType="button"
                defaultValue={data.status}
              // onChange={e => handleChangeCondition(e.target.value)}
              >
                <Radio.Button value={1}>
                  {formatMessage({ id: 'account.active' })}
                </Radio.Button>
                <Radio.Button value={0}>
                  {formatMessage({ id: 'account.deactive' })}
                </Radio.Button>
              </Radio.Group>)
              : (<Skeleton.Input
                style={{ width: 100 }}
                active={true}
                size="default"
              />)
            }
          </Card> */}
        </Affix>
        <div className={styles.antprogridcontent}>
          <div className={styles.antprogridcontentchildren}>
            <Row className={styles.antrow}>
              <Col
                xxl={{ span: 7 }}
                xl={{ span: 7 }}
                lg={{ span: 7 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
                style={{ display: showCustomerForm }}
              >
                <Card style={{ marginBottom: 24 }}>
                  <Card>
                    <div>
                      <div className={styles.avatarHolder}>
                        <Avatar
                          src={data?.avatarUrl || ''}
                          size={128}
                          icon={<UserOutlined />}
                        />
                      </div>
                      <div style={{ paddingTop: '16px', textAlign: 'center' }}>
                        <Title level={5}>{data.firstName || 'Empty'}</Title>
                      </div>
                      <div className={styles.details}>
                        <div style={{ textAlign: 'center' }}>
                          <Paragraph> {data.description || 'Empty'} </Paragraph>
                        </div>
                      </div>
                      <Divider orientation="center">
                        {formatMessage({ id: 'account.status' })}
                      </Divider>
                      <div>
                        <div style={{ textAlign: 'left' }}>
                          {formatStatusToString(data.status)}
                          <Tag color="blue">{data.role || 'Empty'}</Tag>
                        </div>
                      </div>
                      <Divider orientation="center">
                        {formatMessage({ id: 'account.basicInfomation' })}
                      </Divider>
                      <div>
                        <p>
                          <ContactsOutlined
                            style={{ paddingRight: 8 }}
                          ></ContactsOutlined>
                          {data.email || 'Empty'}
                        </p>
                        <p>
                          <PhoneOutlined
                            style={{ paddingRight: 8 }}
                          ></PhoneOutlined>
                          {data.phone || 'Empty'}
                        </p>
                        <p>
                          <HomeOutlined
                            style={{ paddingRight: 8 }}
                          ></HomeOutlined>
                          {data.address || 'Empty'}
                        </p>
                        <Divider orientation="center">
                          {formatMessage({
                            id: 'account.additionalInformation',
                          })}
                        </Divider>
                        <p>
                          <FlagOutlined
                            style={{ paddingRight: 8 }}
                          ></FlagOutlined>
                          {data.city || 'Empty'}
                        </p>
                        <p>
                          <EnvironmentOutlined
                            style={{ paddingRight: 8 }}
                          ></EnvironmentOutlined>
                          {data.country || 'Empty'}
                        </p>
                        <p>
                          <ClockCircleOutlined
                            style={{ paddingRight: 8 }}
                          ></ClockCircleOutlined>
                          {data.updatedAt || 'Empty'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Card>
              </Col>
              {/* operator */}
              <Col span={24} style={{ display: showAdminForm }}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col className="gutter-row" span={24}>
                      <div>
                        <Title level={4}>
                          {formatMessage({ id: 'account.title' })}
                        </Title>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col className="gutter-row" span={8}>
                      <Row justify="center">
                        <Col>
                          <div style={{ textAlign: 'center' }}>
                            <Avatar
                              src={data.avatarUrl || ''}
                              size={228}
                              icon={<UserOutlined />}
                            />
                          </div>
                          <div
                            style={{ paddingTop: '16px', textAlign: 'center' }}
                          >
                            <Title level={5}>
                              {data.lastName + ' ' + data.firstName || 'Empty'}
                            </Title>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            {formatStatusToString(data.status)}
                            <Tag color="blue">{data.role || 'Empty'}</Tag>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Paragraph>
                              {' '}
                              {data.description || 'Empty'}{' '}
                            </Paragraph>
                          </div>
                        </Col>
                      </Row>
                      <Row justify="center">
                        <Col span={4} style={{ textAlign: 'center' }}>
                          <Button
                            style={{ backgroundColor: 'red', color: 'white' }}
                            type="link"
                            shape="circle"
                            // icon={<GoogleOutlined />}
                            size="middle"
                          />
                        </Col>
                        <Col span={4} style={{ textAlign: 'center' }}>
                          <Button
                            style={{
                              backgroundColor: '#1877f2',
                              color: 'white',
                            }}
                            type="link"
                            shape="circle"
                            // icon={<FacebookOutlined />}
                            size="middle"
                          />
                        </Col>
                        <Col span={4} style={{ textAlign: 'center' }}>
                          <Button
                            style={{
                              backgroundColor: '#71c9f8',
                              color: 'white',
                            }}
                            type="link"
                            shape="circle"
                            // icon={<TwitterOutlined />}
                            size="middle"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      className="gutter-row"
                      xxl={{ span: 16 }}
                      xl={{ span: 16 }}
                      lg={{ span: 16 }}
                      md={{ span: 24 }}
                      sm={{ span: 24 }}
                      xs={{ span: 24 }}
                      style={{ padding: '16px' }}
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <div>
                            {/* <Text strong type="secondary">
                              {formatMessage({ id: 'account.basicInfomation' })}
                            </Text> */}
                            <Divider orientation="center">
                              {formatMessage({ id: 'account.basicInfomation' })}
                            </Divider>
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <div>
                            <Descriptions
                              size="default"
                              column={{
                                xxl: 3,
                                xl: 2,
                                lg: 2,
                                md: 2,
                                sm: 1,
                                xs: 1,
                              }}
                            >
                              <Descriptions.Item>
                                <Text keyboard>
                                  <IdcardOutlined />{' '}
                                  {formatMessage({ id: 'account.firstName' })}
                                </Text>
                                : {data.firstName || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <IdcardOutlined />{' '}
                                  {formatMessage({ id: 'account.lastName' })}
                                </Text>
                                : {data.lastName || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <MailOutlined />{' '}
                                  {formatMessage({ id: 'account.email' })}
                                </Text>
                                : {data.email || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <PhoneOutlined />{' '}
                                  {formatMessage({ id: 'account.phone' })}
                                </Text>
                                : {data.phone || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <HomeOutlined />{' '}
                                  {formatMessage({ id: 'account.address' })}
                                </Text>
                                : {data.address || 'Empty'}
                              </Descriptions.Item>
                            </Descriptions>
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <div>
                            <Divider orientation="center">
                              {formatMessage({
                                id: 'account.additionalInformation',
                              })}
                            </Divider>
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <div>
                            <Descriptions
                              size="default"
                              column={{
                                xxl: 3,
                                xl: 2,
                                lg: 2,
                                md: 2,
                                sm: 1,
                                xs: 1,
                              }}
                            >
                              <Descriptions.Item>
                                <Text keyboard>
                                  <EnvironmentOutlined />{' '}
                                  {formatMessage({ id: 'account.city' })}
                                </Text>
                                : {data.city || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <CalendarOutlined />{' '}
                                  {formatMessage({ id: 'account.createAt' })}
                                </Text>
                                : {formatDate(data.createdAt) || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <EnvironmentOutlined />{' '}
                                  {formatMessage({ id: 'account.country' })}
                                </Text>
                                : {data.country || 'Empty'}
                              </Descriptions.Item>
                              <Descriptions.Item>
                                <Text keyboard>
                                  <CalendarOutlined />{' '}
                                  {formatMessage({ id: 'account.updateAt' })}
                                </Text>
                                : {formatDate(data.updatedAt) || 'Empty'}
                              </Descriptions.Item>
                            </Descriptions>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col
                xxl={{ span: 17 }}
                xl={{ span: 17 }}
                lg={{ span: 17 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
                style={{ display: showCustomerForm }}
              >
                <Card>
                  <Card
                    className={styles.antcardhead}
                    title={formatMessage({ id: 'order.order' })}
                  >
                    <Table
                      columns={columns}
                      dataSource={customerOrder.data}
                      loading={loading}
                      scroll={{ x: 768 }}
                      pagination={{
                        showSizeChanger: true,
                        current: page,
                        pageSize: limit,
                        pageSizeOptions: ['5', '10', '20', '30'],
                        onChange: onTableChange,
                        onShowSizeChange: onShowSizeChange,
                      }}
                      // pagination={{defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30']}}
                    />
                  </Card>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </PageHeaderWrapper>
    </>
  )
}

export default DetailAccount
