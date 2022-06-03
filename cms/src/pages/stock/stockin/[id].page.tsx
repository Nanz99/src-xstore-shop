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
  Statistic,
  PageHeader,
  Tabs,
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
import 'dotenv/config'

const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs;

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
  const [stocker, setStocker] = useState({});
  // console.log(
  //   '🚀 ~ file: show data',
  //   listProduct,
  // )
  const renderContent = (column = 2) => (
    <Descriptions size="small" column={column}>
      <Descriptions.Item label={formatMessage({ id: 'stockin.createdBy' })}>{stocker.firstName || 'empty'}</Descriptions.Item>
      <Descriptions.Item label={formatMessage({ id: 'stockin.shippingPrice' })}>
        <a>{numeral(detailStockin.shippingPrice).format(0, 0) || ''}</a>
      </Descriptions.Item>
      <Descriptions.Item label={formatMessage({ id: 'stockin.createAt' })}>{formatDate(detailStockin.createdAt)}</Descriptions.Item>
      <Descriptions.Item label={formatMessage({ id: 'stockin.updateAt' })}>{formatDate(detailStockin.updatedAt)}</Descriptions.Item>
      <Descriptions.Item label={formatMessage({ id: 'stockin.message' })}>
        {detailStockin.message || 'empty'}
      </Descriptions.Item>
    </Descriptions>
  );

  const extraContent = (
    <Row
      style={{
        display: 'flex',
        width: 'max-content',
        justifyContent: 'flex-end',
      }}
    >
      <Statistic
        style={{ textAlign: 'center', marginRight: 32 }}
        title={formatMessage({ id: 'stockin.totalQuantity' })}
        value={totalQuantity || 0}
      />
      <Statistic style={{ textAlign: 'center' }} title={formatMessage({ id: 'stockin.totalPrice' })} value={numeral(detailStockin.grandTotal).format(0, 0) ||
                        '0'} />
    </Row>
  );

  const Content = ({ children, extra }) => {
    return (
      <Row className="content">
        <Col span={18}>
          <div className="main">{children}</div>
        </Col>
        <Col span={6}>
          <div className="extra">{extra}</div>
        </Col>
      </Row>
    );
  };


  const columns = [
    {
      title: 'ID',
      align: 'center',
      key: 'product',
      render: values => {
        return (
          <div>
            <a onClick={() => history.push(`/product/${values.product.id}`)}>
                {values.product.id || ''}
            </a>{' '}
          </div>
        );
      },
    },
    // {
    //   title: formatMessage({ id: 'stockin.name' }),
    //   align: 'center',
    //   key: 'product',
    //   render: values => {
    //     return (
    //       <div>
    //         <a onClick={() => history.push(`/product/${values.product.id}`)}>
    //             {values.product.name || ''}
    //         </a>{' '}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: formatMessage({ id: 'stockin.color' }),
    //   align: 'center',
    //   render: values => {
    //     return (
    //       <div>
    //         <span>
    //           {values?.color || formatMessage({ id: 'common.none' })}
    //         </span>
    //       </div>
    //     )
    //   },
    // },
    {
      title: "Tên sản phẩm",
      align: 'left',
      render: values => {
        return (
          <div>
            <Avatar size={60} src={`${process.env.API_URL}/${values?.product?.product?.imageUrl}`} />
            <span style={{marginLeft: 10}}>
              {values?.product?.product?.name || formatMessage({ id: 'common.none' })}
            </span>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.size' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <span>
              {values?.product.size.size || formatMessage({ id: 'common.none' })}
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
            border: `${values?.product?.color?.color ? '1px solid black' : 'none'}`,
            backgroundColor: `${values?.product?.color?.color}`
          }}>
            {values?.product?.color?.color ? '' : formatMessage({ id: 'common.none' })}
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
            <div>
              <span>
                {formatMessage({ id: 'stockin.createAt' })}:{' '}
                <Tag color="orange">{formatDate(values.createdAt) || ''}</Tag>
              </span>
            </div>
            <div>
              <span>
                {formatMessage({ id: 'stockin.updateAt' })}:{' '}
                <Tag color="geekblue">{formatDate(values.updatedAt) || ''}</Tag>
              </span>
            </div>
          </div>
        )
      },
    },
    // {
    //   title: formatMessage({ id: 'stockin.action' }),
    //   key: 'id',
    //   align: 'center',
    //   render: values => {
    //     return (
    //       <div>
    //          <Button onClick={() => history.push(`/product/${values.product.id}`)} type="link" icon={<EyeOutlined />}>View</Button>
    //       </div>
    //     );
    //   },
    // },
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
      const tempTotalQuantity = result.stockinProducts?.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
      setTotalQuantity(tempTotalQuantity)
      setDetailStockin({ ...result })
      setStocker({ ...result.stocker })
    }
  }

  useMemo(() => {
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
      <Card size="small">
        <Row>
          <PageHeader
            className="site-page-header-responsive"
            onBack={() => window.history.back()}
            title={`#${detailStockin.id || 0}`}
            subTitle={formatMessage({ id: 'stockin.subTitle' })}
            extra={[
              <Button type="primary" onClick={() => handleVisibleExportForm()}>
                {formatMessage({ id: 'stockin.editstockin' })}
              </Button>
            ]}
          >
            <Content extra={extraContent}>{renderContent()}</Content>
          </PageHeader>
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
          width={1000}
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
          dataSource={detailStockin?.stockinProducts?.sort((a, b) => a?.product?.id - b?.product?.id)}
        />
      </Card>
    </div>
  )
}
export default connect(({ products, loading }: ConnectState) => ({
  loadingProduct: loading.effects['products/getAllProductsModel'],
  listProduct: products.listProducts || [],
}))(DetailStockin);
