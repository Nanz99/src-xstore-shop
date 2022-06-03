import React, { useState, useEffect, useRef } from 'react'
import {
  useParams,
  useIntl,
  useRouteMatch,
  connect,
  ProductItem,
  Dispatch,
} from 'umi'
import numeral from 'numeral'
import {
  getDetailOrderService,
  putOrderStatusService,
} from '@/services/order.service'
import { createStockinService } from '@/services/product.service'
import ExportStockoutForm from './order.export.page'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Card,
  Table,
  Tag,
  Row,
  Col,
  Radio,
  Space,
  Affix,
  Button,
  Typography,
  Divider,
  Avatar,
  Select,
  Skeleton,
  Descriptions,
  Badge,
  Modal,
  message,
  Tooltip,
  Steps,
  Input,
} from 'antd'
import {
  EnvironmentOutlined,
  FacebookOutlined,
  GoogleOutlined,
  HomeOutlined,
  LeftOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  SettingFilled,
  TwitterOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { formatDate, formatMessageResponse } from '../../utils/utils'
import styles from './styles.less'
import { ConnectState } from '@/models/connect'
import {
  HIDDEN_STOCKIN_MESSAGE,
  ORDER_STATUS,
  STOCKOUT_STATUS,
} from '@/utils/constants'
import { forEach, values } from 'lodash'
import { useReactToPrint } from 'react-to-print'
import ComponentToPrint from './print.page'
import 'dotenv/config'
import {postStockoutOrder} from '@/services/product.service'


const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { Step } = Steps
const { TextArea } = Input

class ProductParams {
  page: number = 1
  limit: number = 999999
}

interface DetailProps {
  loadings: boolean;
  newLoadings: boolean;
  listProduct?: ProductItem[];
  dispatch: Dispatch;
}

const DetailOrder: React.FC<DetailProps> = props => {
  const { listProduct, dispatch } = props
  const { id } = useParams()
  const componentRef = useRef()
  const { formatMessage } = useIntl()
  const [loadings, setLoadings] = useState([])
  const [detailOrder, setDetailOrder] = useState({})
  const [orderProducts, setOrderProducts] = useState([])
  const [buyer, setBuyer] = useState({})
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [visibleButton, setVisibleButton] = useState(true)
  const [statusComboOrder, setStatusComboOrder] = useState()
  const [exportFormValue, setExportFormValue] = useState({})
  const [visibleExportForm, setVisibleExportForm] = useState(false)
  const [disabledNew, setDisabledNew] = useState(false)
  const [disabledProcessing, setDisabledProcessing] = useState(false)
  const [disabledDone, setDisabledDone] = useState(false)
  const [disabledReject, setDisabledReject] = useState(false)
  const [visibleRejectButton, setVisibleRejectButton] = useState(false)
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false)
  const [visibleConfirmModalEx, setVisibleConfirmModalEx] = useState(false)
  const [statusComboOrderEx, setStatusComboOrderEx] = useState(0)
  const [textArea, setTextArea] = useState('')
  const [totalQuan, setTotalQuan] = useState(0)

  const handleChangeOrder = async value => {
    await fetchChangeOrderStatus(value)
    setStatusComboOrder(value)
  }

  const handleVisible = () => {
    if (statusComboOrder === ORDER_STATUS.PROCESSING) {
      setVisibleButton(false)
    } else {
      setVisibleButton(true)
    }
  }

  const handleCancel = () => {
    setVisibleExportForm(false)
    fetch()
  }

  const handleReject = async value => {
    fetchChangeOrderStatus(value)
    fetch()
  }

  const acceptModalConfirm = async () => {
    if (textArea.length > 0) {
      const tempValue = {
        orderStatus: "REJECT",
        orderStatusMessage: textArea,
        reason: textArea
      }
      const res = await putOrderStatusService(id,tempValue)
      setVisibleConfirmModal(false)
      if (res.success) {
        message.success(formatMessage({ id: 'order.changeSuccess' }))
        setTextArea('')
        await fetch()
      } else {
        message.error(formatMessage({ id: 'order.changeError' }))
        setTextArea('')
        await fetch()
      }
    }
  }

  const showModalConfirm = () => {
    setVisibleConfirmModal(true)
  }

  const hideModalConfirm = () => {
    setVisibleConfirmModal(false)
  }

  const acceptModalConfirmEx = () => {
    handleChangeOrder(statusComboOrderEx)
    setVisibleConfirmModalEx(false)
  }

  const showModalConfirmEx = value => {
    setStatusComboOrderEx(value)
    setVisibleConfirmModalEx(true)
  }

  const hideModalConfirmEx = () => {
    setVisibleConfirmModalEx(false)
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const enterLoadings = async (index: number) => {
    const onLoadings: any = [...loadings]
    onLoadings[index] = true
    setLoadings(onLoadings)
    switch (index) {
      case 0:
        handleVisible()
        await fetchChangeOrderStatus()
        break
      case 1:
        await handleVisibleExportForm()
        break
    }
    const offLoadings: any = [...loadings]
    offLoadings[index] = false
    setLoadings(offLoadings)
  }

  const showRole = value => {
    switch (value) {
      case 'CUSTOMER':
        return <Tag color="#7cb303">Customer</Tag>
      case 'OPERATOR':
        return <Tag color="#1a7cdd">Operater</Tag>
      case 'ADMIN':
        return <Tag color="#f5222d">Administrator</Tag>
      default:
        return <Tag color="default">Unknow</Tag>
    }
  }

  const showActive = value => {
    switch (value) {
      case 0:
        return <Tag color="#f5222d">Inactive</Tag>
      case 1:
        return <Tag color="#7cb305">Active</Tag>
      default:
        return <Tag>Unknow</Tag>
    }
  }


 
  
  const columns = [
    {
      title: formatMessage({ id: 'order.detailProductName' }),
      align: 'left',
      key: 'name',
      render: orderProducts => {
        return (
          <>
          {
           <div style={{paddingLeft: 20}}>
            <Avatar size={60} src={process.env.API_URL + "/"+ orderProducts?.productInfo?.product?.imageUrl} />
            &nbsp;<Text style={{marginLeft: '8px' }}>{orderProducts?.productInfo?.product?.name}</Text>
          </div>}
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.detailSize' }),
      align: 'center',
      render: orderProducts => {
        return (
          <>
          { 
              <div>
                <p style={{ marginBottom: '0' }}>
                  {orderProducts?.productInfo?.size?.size}
                </p>
              </div>
          }
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.detailColor' }),
      align: 'center',
      render: orderProducts => {
        return (
           <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{width: 35, height: 35, borderRadius: "50%",
              border: `${orderProducts?.productInfo?.color?.color ? '1px solid black' : 'none'}`,
              backgroundColor: `${orderProducts?.productInfo?.color?.color}`
            }}>
              {orderProducts?.productInfo?.color?.color ? '' : formatMessage({ id: 'common.none' })}
            </div>
           </div>        
        )
      },
    },
    {
      title: "Giá",
      align: 'center',
      render: orderProducts => {
        return (
          <>
          { 
              <div>
                <p style={{ marginBottom: '0' }}>
                {numeral(orderProducts?.salePrice).format(0, 0) || ''} đ
                </p>
              </div>
          }
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'order.detailQuantity' }),
      align: 'center',
      key: 'quantity',
      render: orderProducts => (
        <>
        {<Text style={{ textAlign: 'center' }}>{orderProducts?.quantity}</Text>}
        </>
      ),
    },
    {
      title: formatMessage({ id: 'order.detailDate' }),
      align: 'center',
      key: 'Date',
      render: orderProducts => {
        return (
          <>
            {
              <>
                <div>
                {formatMessage({ id: 'order.detailCreateAt' })}:{' '}
                <i>{formatDate(orderProducts?.createdAt)}</i>
              </div>
              <div>
                {formatMessage({ id: 'order.detailUpdateAt' })}:{' '}
                <i>{formatDate(orderProducts?.updatedAt)}</i>
              </div>
              </>
            }
          </>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.grandTotal' }),
      render: orderProducts => (
        <>
        {
         <Tag color="red">{numeral(detailOrder.grandTotal).format(0, 0) || ''} đ</Tag> 
        }
        </>
      ),
    },
  ]

  const fetch = async () => {
    dispatch({ type: 'products/getAllProductsModel', payload: ProductParams })
    const res = await getDetailOrderService(id)
    if (res) {
      setDetailOrder({ ...res })
      const tempTotalQuantity = res.orderProducts?.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
      setTotalQuantity(tempTotalQuantity)
      const tempOrderProduct = res.orderProducts?.map((values, item) => ({
        ...values,
        name: values?.product?.name,
        imageUrl: values?.product?.imageUrl,
        unitPrice: values?.product?.salePrice,
        totalPrice: values?.quantity * values?.product?.salePrice,
      }))
      setOrderProducts(tempOrderProduct)
      setBuyer({ ...res.buyer })
      setStatusComboOrder(Number(res.orderStatus))
      if (res.stockoutStatus === STOCKOUT_STATUS.INCOMPLETE) {
        if (res.orderStatus === ORDER_STATUS.PROCESSING) {
          setVisibleButton(false)
        } else {
          setVisibleButton(true)
        }
      } else {
        setVisibleButton(true)
      }
      if (res.orderStatus === ORDER_STATUS.DONE) {
        setVisibleRejectButton(true)
      } else {
        setVisibleRejectButton(false)
      }
    } else {
      console.log('whoop!! wrong detail data')
    }
  }
 
  const fetchChangeOrderStatus = async value => {
    let res = {}
    let tempValue = {}
    if(value.orderStatus === 1 || value === 1){
      tempValue = { orderStatus: "PROCESSING" }
      res = await putOrderStatusService(id, tempValue)
    }
    if(value.orderStatus === 3 || value === 3){
       tempValue = { orderStatus: "DONE" }
      res = await putOrderStatusService(id, tempValue)
    }
    if (res.success) {
      message.success(formatMessage({ id: 'order.changeSuccess' }))
      setTextArea('')
      await fetch()
    } else {
      message.error(formatMessage({ id: 'order.changeError' }))
      setTextArea('')
      await fetch()
    }
  }

  // const fetchStockReject = async () => {
  //   const tempProducts = orderProducts.map((value, item) => ({
  //     productId: value.productId,
  //     quantity: value.quantity,
  //     unitPrice: value.product.retailPrice,
  //     total: value.quantity * value.product.retailPrice,
  //   }))
  //   const values = {
  //     stockinProducts: [...tempProducts],
  //     subTotal: detailOrder.subTotal,
  //     grandTotal: detailOrder.grandTotal,
  //     shippingPrice: detailOrder.shippingFee,
  //     message: HIDDEN_STOCKIN_MESSAGE,
  //   }
  //   await createStockinService(values)
  // }

  const handleVisibleExportForm = async () => {
    const res = await getDetailOrderService(id)
    if (res) {
      setExportFormValue({ ...res })
      setVisibleExportForm(true)
    } else {
      console.log('whoop!! wrong order id')
    }
  }

  useEffect(() => {
    fetch()
  }, [id, visibleExportForm, statusComboOrder])

  useEffect(() => {
    let result = 0
    for (const i of orderProducts) {
      if(i?.quantity > 0){
        result += i.quantity
      } 
    }
    setTotalQuan(result)
  },[orderProducts])

  return (
    <>
      <PageHeaderWrapper>
        {/* Toolbar */}
        <div style={{ display: 'none' }}>
          <ComponentToPrint
            ref={componentRef}
            buyer={buyer}
            orderProducts={orderProducts}
            detailOrder={detailOrder}
          />
        </div>
        {/* Order Information */}
        <Card>
          <Row>
            <Col span={16}>
              <Descriptions
                title={
                  <>
                    <Title level={4}>
                      <b>{formatMessage({ id: 'stockin.title' })}</b>: #
                      {detailOrder.id}
                    </Title>
                    {detailOrder && detailOrder.stockoutStatus === 0 ? (
                      <Tag color="#ff5500">
                        {' '}
                        {formatMessage({ id: 'order.notDeliveredStock' })}{' '}
                      </Tag>
                    ) : (
                      <Tag color="#0070b8">
                        {' '}
                        {formatMessage({ id: 'order.deliveredStock' })}{' '}
                      </Tag>
                    )}
                    {detailOrder && detailOrder.stockoutStatus === 0 ? (
                      <Button disabled={true} size="small">
                        {formatMessage({ id: 'order.print' })}
                      </Button>
                    ) : (
                      <Button size="small" onClick={handlePrint}>
                        {formatMessage({ id: 'order.print' })}
                      </Button>
                    )}
                  </>
                }
                size="small"
                column={2}
              >
                <Descriptions.Item
                  label={formatMessage({ id: 'stockin.owner' })}
                >
                  <i>
                    <Tag color="default">
                      {detailOrder?.fullName}
                    </Tag>
                  </i>
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'stockin.createAt' })}
                >
                  <i>
                    <Tag color="default">
                      {formatDate(detailOrder.createdAt) || 'empty'}
                    </Tag>
                  </i>
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'order.detailPhone' })}
                >
                  <Tag color="default">{detailOrder?.phone || 'empty'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'stockin.updateAt' })}
                >
                  <i>
                    <Tag color="default">
                      {formatDate(detailOrder.updatedAt) || 'empty'}
                    </Tag>
                  </i>
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'order.detailLocale' })}
                >
                  <Tag color="default">
                    {`${detailOrder?.ward}, ${detailOrder?.district}, ${detailOrder?.city}`}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'stockin.message' })}
                >
                  {detailOrder.message || 'empty'}
                </Descriptions.Item>
                <Descriptions.Item
                  label={formatMessage({ id: 'order.detailOrderAddress' })}
                >
                  <Tag color="default">{detailOrder.address || 'empty'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label="Email"
                >
                  <Tag color="default">{detailOrder?.email || 'empty'}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions
                extra={
                  <>
                    {detailOrder && typeof statusComboOrder === 'number' ? (
                      <Button
                        disabled={visibleRejectButton}
                        onClick={() => showModalConfirm()}
                      >
                        {formatMessage({ id: 'order.statusReject' })}
                        &nbsp;
                        <Tooltip
                          title={formatMessage({ id: 'product.guideReject' })}
                        >
                          <QuestionCircleOutlined
                            style={{ fontSize: '14px' }}
                          />{' '}
                        </Tooltip>
                      </Button>
                    ) : (
                      // <Radio.Group
                      //   value={Number(statusComboOrder)}
                      //   onChange={evt => handleChangeOrder(evt.target.value)}
                      // >
                      //   <Radio.Button key={0} value={0} disabled={disabledNew}>
                      //     {formatMessage({ id: 'order.statusNew' })}
                      //   </Radio.Button>
                      //   <Radio.Button key={1} value={1} disabled={disabledProcessing}>
                      //     {formatMessage({ id: 'order.statusProcessing' })}
                      //   </Radio.Button>
                      //   <Radio.Button key={2} value={2} disabled={disabledDone}>
                      //     {formatMessage({ id: 'order.statusDone' })}
                      //   </Radio.Button>
                      //   <Radio.Button key={3} value={3} disabled={disabledReject}>
                      //     {formatMessage({ id: 'order.statusReject' })}
                      //     &nbsp;
                      //     <Tooltip
                      //       title={formatMessage({ id: 'product.guideReject' })}
                      //     >
                      //       <QuestionCircleOutlined style={{ fontSize: '14px' }} />{' '}
                      //     </Tooltip>
                      //   </Radio.Button>
                      // </Radio.Group>
                      <Skeleton.Input
                        style={{ width: 234 }}
                        active={true}
                        size="default"
                      />
                    )}
                    <Button
                      style={{ marginLeft: '8px' }}
                      type="primary"
                      disabled={visibleButton}
                      loading={loadings[1]}
                      onClick={() => enterLoadings(1)}
                    >
                      <b>{formatMessage({ id: 'order.deliverStock' })}</b>
                    </Button>
                  </>
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
                      <Title level={4}>{totalQuan}</Title>
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
                        {formatMessage({ id: 'stockin.subTotal' })}
                      </Text>
                    </Col>
                    <Col
                      span={24}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Title level={4}>
                        {' '}
                        {numeral(detailOrder.subTotal).format(0, 0) ||
                          ''} đ{' '}
                      </Title>
                    </Col>
                  </Row>
                </Col>
              </Row>
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
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Text type="secondary">
                        {formatMessage({ id: 'order.detailShipPrice' })}
                      </Text>
                    </Col>
                    <Col
                      span={24}
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Title level={4}> {' '}
                        {numeral(detailOrder.shippingFee).format(0, 0) || ''} đ{' '}</Title>
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
                        {formatMessage({ id: 'stockin.grandTotal' })}
                      </Text>
                    </Col>
                    <Col
                      span={24}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Title level={4}>
                        {' '}
                        {numeral(detailOrder.grandTotal).format(0, 0) ||
                          ''} đ{' '}
                      </Title>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        {/* Status progress */}
        <Card>
          <Steps
            size="small"
            current={Number(statusComboOrder)}
            onChange={showModalConfirmEx}
          >
            <Step
              title={formatMessage({ id: 'order.statusNEW' })}
              description={formatMessage({ id: 'order.detailWaitingPayment' })}
            />
            <Step
              title={formatMessage({ id: 'order.statusPROCESSING' })}
              description={formatMessage({ id: 'order.detailWaitingDeliver' })}
            />
             <Step
              disabled={true}
              title={formatMessage({ id: 'order.deliverStock' })}
              description={formatMessage({ id: 'order.waitingDeliverStock' })}
            />
            <Step
              title={formatMessage({ id: 'order.statusDONE' })}
              description={formatMessage({ id: 'order.detailAllDone' })}
            />
            <Step
              disabled={true}
              title={formatMessage({ id: 'order.statusREJECT' })}
              description={
                <div>
                  <Tooltip
                    placement="topLeft"
                    title={detailOrder.orderStatusMessage || 'empty'}
                  >
                    <Paragraph
                      ellipsis={{
                        rows: 3,
                        expandable: true,
                        symbol: 'more',
                      }}
                    >
                      {formatMessage({ id: 'order.statusReasonReject' })}:{' '}
                      <br /> {detailOrder.orderStatusMessage || 'empty'}{' '}
                    </Paragraph>
                  </Tooltip>
                </div>
              }
            />
          </Steps>
        </Card>
        {/* Main body */}
        <Modal
                  maskClosable={false}
                  visible={visibleExportForm}
                  title={
                    <strong>{formatMessage({ id: 'stockout.addNew' })}</strong>
                  }
                  onCancel={handleCancel}
                  centered={true}
                  footer={null}
                  width={1000}
                >
                  <ExportStockoutForm
                    listProduct={listProduct}
                    handleChangeOrder={handleChangeOrder}
                    exportFormValue={detailOrder}
                    handleCancel={handleCancel}
                  />
                </Modal>
                <Modal
                  title={formatMessage({ id: 'order.confirm' })}
                  visible={visibleConfirmModal}
                  onOk={acceptModalConfirm}
                  onCancel={hideModalConfirm}
                  okText={formatMessage({ id: 'order.accept' })}
                  cancelText={formatMessage({ id: 'order.cancel' })}
                >
                  <p>
                    {formatMessage({ id: 'order.warningRejectOrderStatus' })}
                  </p>
                  <TextArea
                    showCount
                    maxLength={100}
                    value={textArea}
                    onChange={e => setTextArea(e.target.value)}
                  />
                </Modal>
                <Modal
                  title={formatMessage({ id: 'order.confirm' })}
                  visible={visibleConfirmModalEx}
                  onOk={acceptModalConfirmEx}
                  onCancel={hideModalConfirmEx}
                  okText={formatMessage({ id: 'order.accept' })}
                  cancelText={formatMessage({ id: 'order.cancel' })}
                >
                  <p>
                    {formatMessage({ id: 'order.warningChangeOrderStatus' })}
                  </p>
                </Modal>
        <div>
          <Row> 
            {/* Products Ordered */}
            <Col span={24}>
              <Card>
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <Text style={{ paddingBottom: '8px' }}>
                      {formatMessage({ id: 'order.detailProductsOrdered' })}
                    </Text>
                  </Col>
                  <Col span={24}>
                    <Table
                      style={{ width: '100%' }}
                      columns={columns}
                      dataSource={orderProducts?.filter(item => item?.quantity > 0)}
                      pagination={false}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    </>
  )
}

export default connect(({ products, loading }: ConnectState) => ({
  loadingProduct: loading.effects['products/getAllProductsModel'],
  listProduct: products.listProducts || [],
}))(DetailOrder)
