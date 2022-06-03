import React, { useState, useEffect, Fragment } from 'react'
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
import { useParams, history, useIntl, getLocale, connect, Dispatch, ProductItem } from 'umi'
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
  getDetailStockinService,
  editStockinStatusService,
} from '@/services/product.service'
import EditStockinForm from './stock.edit.page'
import { formatDate } from '@/utils/utils'
import { getDetailOrderService } from '@/services/order.service'
import { ConnectState } from '@/models/connect'

const { Title, Paragraph, Text } = Typography

interface DetailStockinProps {
  loadingProduct: Boolean;
  listProduct?: ProductItem[];
  dispatch: Dispatch;
}

const DetailStockin: React.FC<DetailStockinProps> = props => {
  const { loadingProduct, listProduct, dispatch } = props
  const { formatMessage } = useIntl()
  const { id } = useParams()
  const lang = getLocale()
  const [visibleSreenShot, setShowScreenShot] = useState(false)
  const [detailStockin, setDetailStockin] = useState({})
  const [totalQuantity, setTotalQuantity] = useState(0)
  const { stockinStatus } = detailStockin
  const [exportFormValue, setExportFormValue] = useState({});
  const [visibleExportForm, setVisibleExportForm] = useState(false)
  const [visibleVerify, setVisibleVerify] = useState(false)

  const columns = [
    {
      title: 'Product ID',
      align: 'center',
      key: 'product',
      render: values => {
        return (
          <div>
            <a onClick={() => history.push(`/product/${values.product.id}`)}>
                #{values.product.id || ''}
            </a>{' '}
          </div>
        );
      },
    },
    {
      title: 'Quantity',
      align: 'center',
      key: 'quantity',
      render: values => <Text> {values.quantity} </Text>
    },
    {
      title: 'Unit Price',
      align: 'center',
      key: 'unitPrice',
      render: values => <Tag color="red">{numeral(values.unitPrice).format(0, 0) || ''} đ</Tag>,
    },
    {
      title: 'Total',
      align: 'center',
      key: 'total',
      render: values => <Tag color="red">{numeral(values.total).format(0, 0) || ''} đ</Tag>,
    },
    {
      title: 'Date',
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'stockin.createAt' })}:{' '}
              <Tag color="orange">{formatDate(values.createdAt) || ''}</Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'stockin.updateAt' })}:{' '}
              <Tag color="geekblue">{formatDate(values.updatedAt) || ''}</Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: 'Action',
      key: 'id',
      align: 'center',
      render: values => {
        return (
          <div>
             <Button onClick={() => history.push(`/product/${values.product.id}`)} type="link" icon={<EyeOutlined />}>View</Button>
          </div>
        );
      },
    },
  ];

  function handleCancelForm() {
    setVisibleExportForm(false)
  }

  const fetch = async () => {
    const result = await getDetailStockinService(id)
    dispatch({ type: 'products/getAllProductsModel', payload: {
      page: 1,
      limit: 999999,
    }});
    if (result) {
      const tempTotalQuantity = result.stockinProducts.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
      setTotalQuantity(tempTotalQuantity)
      setDetailStockin({ ...result })
    }
  }

  useEffect(() => {
    fetch()
  }, [id])

  const handleConfirmComplete = () => {
    Modal.confirm({
      title: formatMessage({ id: 'Stockin.quesCompleteApprove' }),
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({ id: 'Stockin.yes' }),
      cancelText: formatMessage({ id: 'Stockin.no' }),
      onOk: handleStockinComplete,
      onCancel: handleCancel,
      visible: visibleVerify,
    })
  }

  const handleConfirmReject = () => {
    Modal.confirm({
      title: formatMessage({ id: 'Stockin.quesRejectApprove' }),
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({ id: 'Stockin.yes' }),
      cancelText: formatMessage({ id: 'Stockin.no' }),
      onOk: handleStockinReject,
      onCancel: handleCancel,
      visible: visibleVerify,
    })
  }
  const handleCancel = () => {
    // setVisibleVerify(false);
    fetch()
  }

  const handleVisibleExportForm = async (values) => {
    setVisibleExportForm(true)
  }

  const handleStockinComplete = async () => {
    const data = {
      stockinStatus: 1,
    }
    const { success } = await editStockinStatusService(id, data)
    if (success == true) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'stockin.changeStatusSuccess' }),
      })
      await fetch()
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'stockin.changeStatusFailed' }),
      })
    }
  }

  const handleStockinReject = async res => {
    const data = {
      stockinStatus: 2,
    }
    const { success } = await editStockinStatusService(id, data)
    if (success == true) {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        message: formatMessage({ id: 'stockin.changeStatusSuccess' }),
      })
      await fetch()
    } else {
      notification.success({
        icon: <CheckCircleOutlined style={{ color: 'red' }} />,
        message: formatMessage({ id: 'stockin.changeStatusFailed' }),
      })
    }
  }

  return (
    <div>
      <Card title="Stockin Infomation">
        <Row>
          <Col span={14}>
            <Descriptions
              title={
                <Title level={4}>
                  <b>{formatMessage({ id: 'stockin.title' })} </b>: #{detailStockin.id || 0}
                </Title>
              }
              size="small"
              column={2}
            >
              <Descriptions.Item
                label={formatMessage({ id: 'stockin.createAt' })}
              >
                <i><Tag color="#fca916">{formatDate(detailStockin.createdAt)}</Tag></i>
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockin.shippingPrice' })}
              >
                <Tag color="#f6222d">{numeral(detailStockin.shippingPrice).format(0, 0) || ''} đ</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockin.updateAt' })}
              >
                 <i><Tag color="#8654eb">{formatDate(detailStockin.updatedAt)}</Tag></i>
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockin.subTotal' })}
              >
                <Tag color="#f6222d">{numeral(detailStockin.subTotal).format(0, 0) || ''} đ</Tag> 
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockin.message' })}
              >
                {detailStockin.message}
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'stockin.grandTotal' })}
              >
                <Tag color="#f6222d">{numeral(detailStockin.grandTotal).format(0, 0) || ''} đ</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={10}>
            <Descriptions
              extra={
                <Button type="primary" onClick={() => handleVisibleExportForm()}>
                  {formatMessage({ id: 'stockin.editstockin' })}
                </Button>
              }
              size="small"
              layout="vertical"
            >
              {/* {<Text type="secondary">{formatMessage({ id: 'stockin.totalQuantity' })}</Text>} */}
              {/* label={formatMessage({ id: 'stockin.totalPrice' })} */}
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
                      {formatMessage({ id: 'stockin.totalQuantity' })}
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
                      {formatMessage({ id: 'stockin.totalPrice' })}
                    </Text>
                  </Col>
                  <Col
                    span={24}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Title level={4}>
                      {' '}
                      {numeral(detailStockin.grandTotal).format(0, 0) ||
                        ''} đ{' '}
                    </Title>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          maskClosable={false}
          visible={visibleExportForm}
          title={
            <strong>{formatMessage({ id: 'stockin.addNew' })}</strong>
          }
          onCancel={handleCancelForm}
          centered={true}
          footer={null}
          width={850}
        >
          <EditStockinForm
            listProduct={listProduct}
            exportFormValue={detailStockin}
            handleCancel={handleCancelForm}
          />
        </Modal>
      </Card>
      <Card title={formatMessage({ id: 'stockin.productInfo' })}>
        <Table
          columns={columns}
          dataSource={detailStockin.stockinProducts}
        />
      </Card>
    </div>
  )
}
export default connect(({ products, loading }: ConnectState) => ({
  loadingProduct: loading.effects['products/getAllProductsModel'],
  listProduct: products.listProducts || [],
}))(DetailStockin);
