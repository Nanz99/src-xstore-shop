import React, { useState, useEffect, useMemo } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  notification,
  Tag,
  Row,
  Col,
  Radio,
  Typography,
  Select,
} from 'antd'
import {
  useIntl,
  Dispatch,
  useLocation,
  connect,
  getLocale,
  history,
  ProductItem,
} from 'umi'
import numeral from 'numeral'
import { StockinItem } from '@/models/stockin.model'
import { ColumnProps } from 'antd/lib/table'
import { ConnectState } from '@/models/connect'
import { debounce, isEmpty, values } from 'lodash'
import {
  EditOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { format } from 'prettier'
import dayjs from 'dayjs'
// import EditstockinForm from './stockin.edit.page';
import CreateStockinForm from './stock.create.page'
import { HIDDEN_STOCKIN_MESSAGE } from '@/utils/constants'
import { formatDate } from '@/utils/utils'
// import { deleteStockinService } from '@/services/categories.service';

const { Title, Paragraph, Text } = Typography
const { Option } = Select

class Params {
  page: number = 1
  limit: number = 10
  id?: number
  verified?: boolean
  stockinStatus?: string
  sortByDate?: string
}

class ProductParams {
  page: number = 1
  limit: number = 999999
}

interface StockinProps {
  loadingStockin: Boolean
  loadingProduct: Boolean
  listStockin?: StockinItem[]
  listProduct?: ProductItem[]
  total: number
  loading: boolean
  dispatch: Dispatch
}

const Stockin: React.FC<StockinProps> = props => {
  const {
    dispatch,
    listStockin,
    listProduct,
    total,
    loadingStockin,
    loadingProduct,
  } = props
  const [params, setParams] = useState(new Params())
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()
  const locale = getLocale()
  const [visibleEditForm, setVisibleEditForm] = useState(false)
  const [visibleAddForm, setVisibleAddForm] = useState(false)
  const [idstockin, setIdStockin] = useState()


  //   console.log(
  //   '🚀 ~ file: show data',
  //   listStockin,
  // )
  const fetch = async () => {
    dispatch({ type: 'stockin/getListStockinModel', payload: params })
    dispatch({ type: 'products/getAllProductsModel', payload: ProductParams })
  }

  useMemo(() => {
    fetch()
  }, [params, pathname])

  // const listRemoveHiddenObject = () => {
  //   let values: any = [listStockin]
  //   if (listStockin && listStockin.length > 0) {
  //     values = listStockin?.filter(
  //       item => item.message !== HIDDEN_STOCKIN_MESSAGE,
  //     )
  //   }
  //   return values
  // }

  // const filterCounter = () => {

  //   let values: any = [listStockin];
  //   if (listStockin && listStockin.length > 0) {
  //     values = listStockin?.filter(
  //       item => item.message !== HIDDEN_STOCKIN_MESSAGE,
  //     )
  //   }
  //   return values.length;
  // }

  const handleCancel = () => {
    setVisibleEditForm(false)
    setVisibleAddForm(false)
    fetch()
  }

  const handleVisibleEditForm = id => () => {
    setVisibleEditForm(true)
    setIdStockin(id)
  }

  const handleShowAddForm = () => {
    setVisibleAddForm(true)
  }

  //   const handleConfirmDelete = id => () => {
  //     Modal.confirm({
  //       title: formatMessage({ id: 'stockin.questDelete' }),
  //       icon: <ExclamationCircleOutlined />,
  //       onCancel: handleCancel,
  //       onOk: handleDelete(id),
  //       okText: formatMessage({ id: 'stockin.delete' }),
  //     });
  //   };
  //   const handleDelete = id => async () => {
  //     const { success } = await deleteStockinService(id);
  //     if (success) {
  //       notification.success({
  //         icon: <CheckCircleOutlined style={{ color: 'green' }} />,
  //         message: formatMessage({ id: 'stockin.delSuccess' }),
  //       });
  //     } else {
  //       notification.success({
  //         icon: <CheckCircleOutlined style={{ color: 'red' }} />,
  //         message: formatMessage({ id: 'stockin.delFailed' }),
  //       });
  //     }
  //     await fetch();
  //   };

  let onChangeId = value => {
    let tempId = value
    if (isEmpty(tempId)) {
      tempId = ''
    } else {
      tempId = Number(value)
    }
    setParams({
      ...params,
      id: tempId,
    })
  }
  onChangeId = debounce(onChangeId, 600)

  let handleChangeStatus = status => {
    setParams({
      ...params,
      stockinStatus: status,
    })
  }

  const showTotal = (total: number) => {
    return `${formatMessage({ id: 'product.totalItem' })} ${total}`
  }

  const onTableChange = (page: number) => {
    const newParams = { ...params }
    if (params.page !== page) {
      newParams.page = page
    }
    setParams(newParams)
  }

  const onShowSizeChange = (current: number, size: number) => {
    if (params.limit !== size) {
      params.limit = size
    }
  }

  //Date Sort
  let handleChangeSortDate = sort => {
    setParams({
      ...params,
      sortByDate: sort,
    })
  }

  const columns: ColumnProps<StockinItem>[] = [
    {
      title: formatMessage({ id: 'stockin.index' }),
      align: 'center',
      render: (v, t, i) => (params.page - 1) * params.limit + i + 1,
    },
    {
      title: 'ID',
      align: 'center',
      render: values => {
        return (
          <div>
            <a onClick={() => history.push(`/stock/stockin/${values.id}`)}>
            {' #'}
              {values.id}
            </a>
           
          </div>
        )
      },
    },
  
    // {
    //   title: formatMessage({ id: 'stockin.size' }),
    //   align: 'center',
    //   render: values => {
    //     return (
    //       <div>
    //         <p>{values?.size || formatMessage({ id: 'common.none' })}</p>
    //       </div>
    //     )
    //   },
    // },
      {
      title: formatMessage({ id: 'stockin.subTotal' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {/* {formatMessage({ id: 'stockin.subTotal' })}:{' '} */}
              <Tag color="#2db7f5">
                {numeral(values.subTotal).format(0, 0) || ''} đ
              </Tag>
            </Paragraph>
            
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.shippingPrice' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {/* {formatMessage({ id: 'stockin.ship' })}:{' '} */}
              <Tag color="#2db7f5">
                {numeral(values.shippingPrice).format(0, 0) || ''} đ
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
  
    {
      title: formatMessage({ id: 'stockin.grandTotal' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {/* {formatMessage({ id: 'stockin.grandTotal' })}:{' '} */}
              <Tag color="#f50">
                {numeral(values.grandTotal).format(0, 0) || ''} đ
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.date' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Paragraph>
              {formatMessage({ id: 'stockin.createAt' })}:{' '}
              <Tag color="magenta">
                <CalendarOutlined /> {formatDate(values.createdAt) || ''}
              </Tag>
            </Paragraph>
            <Paragraph>
              {formatMessage({ id: 'stockin.updateAt' })}:{' '}
              <Tag color="magenta">
                <CalendarOutlined /> {formatDate(values.updatedAt) || ''}
              </Tag>
            </Paragraph>
          </div>
        )
      },
    },
      {
      title: formatMessage({ id: 'stockin.message' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <p>
              {values.message}{' '}
            </p>
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'stockin.action' }),
      align: 'center',
      render: values => {
        return (
          <div>
            <Button
              onClick={() => history.push(`/stock/stockin/${values.id}`)}
              type="link"
              icon={<EyeOutlined />}
            >
              View
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card size="small" style={{ padding: '6px 12px 6px 12px' }}>
        <Row>
          <Col
            span={24}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {/* Sort date */}
            <Select
              placeholder={formatMessage({ id: 'product.sortDate' })}
              style={{ width: 120, marginLeft: '8px' }}
              onChange={handleChangeSortDate}
              allowClear
            >
              <Option value="ALL">
                {formatMessage({ id: 'product.sortAll' })}
              </Option>
              <Option value="ASC">
                {formatMessage({ id: 'product.sortAsc' })}
              </Option>
              <Option value="DESC">
                {formatMessage({ id: 'product.sortDesc' })}
              </Option>
            </Select>

            {/* Search id stockin */}
            <Input.Search
              style={{ width: 200, marginLeft: '8px' }}
              onSearch={onChangeId}
              placeholder={formatMessage({ id: 'stockin.stockin' })}
              name="idStockin"
              allowClear
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <Button type="dashed" block onClick={handleShowAddForm}>
          <PlusCircleOutlined />
          {formatMessage({ id: 'stockin.addNew' })}
        </Button>
        <Table
          columns={columns}
          dataSource={listStockin}
          loading={loadingStockin}
          bordered
          pagination={{
            showSizeChanger: true,
            current: params.page,
            pageSize: params.limit,
            total: total,
            showTotal: showTotal,
            onChange: onTableChange,
            onShowSizeChange: onShowSizeChange,
          }}
        />
        <Modal
          maskClosable={false}
          visible={visibleAddForm}
          title={<strong>{formatMessage({ id: 'stockin.addNew' })}</strong>}
          onCancel={handleCancel}
          centered={true}
          footer={null}
          width={1000}
        >
          <CreateStockinForm
            listProduct={listProduct}
            handleCancel={handleCancel}
          />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ stockin, products, loading }: ConnectState) => ({
  loadingStockin: loading.effects['stockin/getListStockinModel'],
  listStockin: stockin?.listStockin || [],
  loadingProduct: loading.effects['products/getAllProductsModel'],
  listProduct: products.listProducts || [],
  total: stockin.total,
}))(Stockin)
