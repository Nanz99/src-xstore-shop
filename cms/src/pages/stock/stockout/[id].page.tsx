import React, { useState, useEffect, Fragment, useMemo } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Descriptions,
  Tag,
  Tooltip,
  Divider,
  Avatar,
  Modal,
  Affix,
  notification,
  Table,
  message,
  Typography,
} from 'antd'
import numeral from 'numeral'
import { useParams, history, useIntl, getLocale } from 'umi'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LikeOutlined,
  EyeOutlined,
  CommentOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  FileImageOutlined,
  WarningOutlined,
  StopOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  PieChartOutlined,
  CodepenCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import TypeComponent from '@/components/TypeComponent'
import {
  getDetailStockoutService,
} from '@/services/product.service'
import { formatDate } from '@/utils/utils'
import 'dotenv/config'

const { Title, Paragraph, Text } = Typography

const DetailStockout = props => {
  const { formatMessage } = useIntl()
  const { id } = useParams()
  const lang = getLocale()
  const [visibleSreenShot, setShowScreenShot] = useState(false)
  const [detailStockout, setDetailStockout] = useState({})
  const [totalQuantity, setTotalQuantity] = useState(0)
  const { stockoutStatus } = detailStockout
  const [visibleVerify, setVisibleVerify] = useState(false)

  const columns = [
    {
      title: "ID",
      align: 'center',
      render: values => {
        return (
          <div>
            <span>
              {values?.productInfo?.id || formatMessage({ id: 'common.none' })}
            </span>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.name' }),
      align: 'left',
      key: 'product',
      render: values => {
        console.log(values)
        return (
          <div>
             <Avatar size={60} src={process.env.API_URL + "/"+ values?.productInfo?.product?.imageUrl} />
            <span style={{ marginLeft: '12px' }}>
                {values?.productInfo?.product?.name || ''}
            </span>{' '}
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'stockin.size' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <span>
              {values?.productInfo?.size?.size || formatMessage({ id: 'common.none' })}
            </span>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.color' }),
      align: 'center',
      render: values => {
        return (
          <div style={{width: 35, height: 35, borderRadius: "50%",
            border: `${values?.productInfo?.color?.color ? '1px solid black' : 'none'}`,
            backgroundColor: `${values?.productInfo?.color?.color}`
          }}>
            {values?.productInfo?.color?.color ? '' : formatMessage({ id: 'common.none' })}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.totalQuantity' }),
      align: 'center',
      key: 'quantity',
      render: values => <Text> {values.quantity} </Text>
    },
    {
      title: formatMessage({ id: 'stockin.unitPrice' }),
      align: 'center',
      key: 'unitPrice',
      render: values => <Tag color="red">{numeral(values.unitPrice).format(0, 0) || ''} đ</Tag>,
    },
    {
      title: formatMessage({ id: 'stockin.totalPrice' }),
      align: 'center',
      key: 'total',
      render: values => <Tag color="red">{numeral(values.total).format(0, 0) || ''} đ</Tag>,
    },
    {
      title: formatMessage({ id: 'stockin.date' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'stockout.createAt' })}:{' '}
              <Tag color="orange">{formatDate(values.createdAt) || ''}</Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'stockout.updateAt' })}:{' '}
              <Tag color="geekblue">{formatDate(values.updatedAt) || ''}</Tag>
            </Paragraph>
          </div>
        )
      },
    },
  ];

  const fetch = async () => {
    const result = await getDetailStockoutService(id)
    if (result.success !== false) {
      const tempTotalQuantity = result.data.stockoutProducts.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
      setTotalQuantity(tempTotalQuantity)
      setDetailStockout({ ...result.data })
    }
  }

  useMemo(() => {
    fetch()
  }, [id])

  // const handleConfirmComplete = () => {
  //   Modal.confirm({
  //     title: formatMessage({ id: 'Stockout.quesCompleteApprove' }),
  //     icon: <ExclamationCircleOutlined />,
  //     okText: formatMessage({ id: 'Stockout.yes' }),
  //     cancelText: formatMessage({ id: 'Stockout.no' }),
  //     onOk: handleStockoutComplete,
  //     onCancel: handleCancel,
  //     visible: visibleVerify,
  //   })
  // }

  // const handleConfirmReject = () => {
  //   Modal.confirm({
  //     title: formatMessage({ id: 'Stockout.quesRejectApprove' }),
  //     icon: <ExclamationCircleOutlined />,
  //     okText: formatMessage({ id: 'Stockout.yes' }),
  //     cancelText: formatMessage({ id: 'Stockout.no' }),
  //     onOk: handleStockoutReject,
  //     onCancel: handleCancel,
  //     visible: visibleVerify,
  //   })
  // }
  const handleCancel = () => {
    // setVisibleVerify(false);
    fetch()
  }

  // const handleStockoutComplete = async () => {
  //   const data = {
  //     stockoutStatus: 1,
  //   }
  //   const { success } = await editStockoutStatusService(id, data)
  //   if (success == true) {
  //     notification.success({
  //       icon: <CheckCircleOutlined style={{ color: 'green' }} />,
  //       message: formatMessage({ id: 'stockout.changeStatusSuccess' }),
  //     })
  //     await fetch()
  //   } else {
  //     notification.success({
  //       icon: <CheckCircleOutlined style={{ color: 'red' }} />,
  //       message: formatMessage({ id: 'stockout.changeStatusFailed' }),
  //     })
  //   }
  // }

  // const handleStockoutReject = async res => {
  //   const data = {
  //     stockoutStatus: 2,
  //   }
  //   const { success } = await editStockoutStatusService(id, data)
  //   if (success == true) {
  //     notification.success({
  //       icon: <CheckCircleOutlined style={{ color: 'green' }} />,
  //       message: formatMessage({ id: 'stockout.changeStatusSuccess' }),
  //     })
  //     await fetch()
  //   } else {
  //     notification.success({
  //       icon: <CheckCircleOutlined style={{ color: 'red' }} />,
  //       message: formatMessage({ id: 'stockout.changeStatusFailed' }),
  //     })
  //   }
  // }

  return (
    <div>
      <Card title="Stockout Infomation">
        <Row>
          <Col span={14}>
            <Descriptions
              title={
                <Title level={4}>
                  <b>{formatMessage({ id: 'stockout.title' })} </b>: #{detailStockout.id}
                </Title>
              }
              size="small"
              column={2}
            >
              <Descriptions.Item
                label={formatMessage({ id: 'stockout.createAt' })}
              >
                <i><Tag color="#fca916">{formatDate(detailStockout.createdAt)}</Tag></i>
              </Descriptions.Item>
              {/* <Descriptions.Item
                label={formatMessage({ id: 'stockout.shippingPrice' })}
              >
                <Tag color="#f6222d">{numeral(detailStockout.shippingPrice).format(0, 0) || ''} đ</Tag>
              </Descriptions.Item> */}
              
              <Descriptions.Item
                label={formatMessage({ id: 'stockout.subTotal' })}
              >
                <Tag color="#f6222d">{numeral(detailStockout.subTotal).format(0, 0) || ''} đ</Tag> 
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockout.updateAt' })}
              >
                 <i><Tag color="#8654eb">{formatDate(detailStockout.updatedAt)}</Tag></i>
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockout.message' })}
              >
                {detailStockout.message}
              </Descriptions.Item>
              {/* <Descriptions.Item
                label={formatMessage({ id: 'stockout.grandTotal' })}
              >
                <Tag color="#f6222d">{numeral(detailStockout.grandTotal).format(0, 0) || ''} đ</Tag>
              </Descriptions.Item> */}
            </Descriptions>
          </Col>
          <Col span={10}>
            <Descriptions
              size="small"
              layout="vertical"
            >
              {/* {<Text type="secondary">{formatMessage({ id: 'stockout.totalQuantity' })}</Text>} */}
              {/* label={formatMessage({ id: 'stockout.totalPrice' })} */}
            </Descriptions>
            <Row justify="end" gutter={50}>
              <Col
                span={12}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Row>
                  <Col
                    span={24}
                    style={{
                      paddingBottom: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Text type="secondary">
                      {formatMessage({ id: 'stockout.totalQuantity' })}
                    </Text>
                  </Col>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Title level={4}> {totalQuantity} </Title>
                  </Col>
                </Row>
              </Col>
              <Col
                span={12}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Row>
                  <Col
                    span={24}
                    style={{
                      paddingBottom: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Text type="secondary">
                      {formatMessage({ id: 'stockout.totalPrice' })}
                    </Text>
                  </Col>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Title level={4}>
                      {' '}
                      {numeral(detailStockout.grandTotal).format(0, 0) ||
                        ''} đ{' '}
                    </Title>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>  
      </Card>
      <Card title={formatMessage({ id: 'stockout.productInfo' })}>
        <Table
          columns={columns}
          dataSource={detailStockout?.stockoutProducts
            ?.filter(item => item?.quantity > 0)
            ?.sort((a, b) => a.productInfo?.id - b?.productInfo?.id)
          }
        />
      </Card>
    </div>
  )
}
export default DetailStockout
