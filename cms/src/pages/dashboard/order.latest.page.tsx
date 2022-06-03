import { EyeOutlined } from '@ant-design/icons'
import { Button, Card, Table, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table';
import React, { useMemo, useState } from 'react'
import { connect, useIntl, getLocale, history } from 'umi'
import { ProductItem } from './../../models/product.model';
import { ConnectState } from '@/models/connect';
import dayjs from 'dayjs';
import numeral from 'numeral'
import './styles.less'


class Params {
   page: number = 1
   limit: number = 10
   name?: string
   verified?: boolean
   status?: number
   sortByPrice?: string
   sortByDate?: string
   condition?: string
}
function OrderLatestPage({ loading, listOrder, dispatch }) {
   const { formatMessage } = useIntl()
   const locale = getLocale()
   const [params, setParams] = useState(new Params())
   useMemo(() => {
      dispatch({ type: 'order/getListOrderModel' })
   }, [])



   const showOrderStatus = value => {
      switch (value) {
         case 0:
            return (
               <Tag color="#2db7f5" style={{ borderRadius: '50px',padding: '3px 18px'}}> {formatMessage({ id: 'order.statusNew' })} </Tag>
            )
         case 1:
            return (
               <Tag color="#36CBCB" style={{ borderRadius: '50px',padding: '3px 18px'}}>
                  {' '}
                  {formatMessage({ id: 'order.statusProcessing' })}{' '}
               </Tag>
            )
         case 2:
            return (
               <Tag style={{ borderRadius: '50px',padding: '3px 18px'}} color="#25a244"> {formatMessage({ id: 'order.statusDelivering' })} </Tag>
            )
         case 3:
            return (
               <Tag style={{ borderRadius: '50px',padding: '3px 18px'}} color="#ffd000"> {formatMessage({ id: 'order.statusDone' })} </Tag>
            )
         case 4:
            return (
               <Tag style={{ borderRadius: '50px',padding: '3px 18px'}} color="#ff0000"> {formatMessage({ id: 'order.statusReject' })} </Tag>
            )
         default:
            return (
               <Tag style={{ borderRadius: '50px',padding: '3px 18px'}} color="gold"> {formatMessage({ id: 'common.empty' })} </Tag>
            )
      }
   }
   const columns: ColumnProps<ProductItem>[] = [
      //Index column
      {
         title: formatMessage({ id: 'product.index' }),
         key: 'ID',
         align: 'center',
         render: (v, t, i) => (<div style={{ height: '20px', width: '20px', lineHeight: '20px', borderRadius: '50%', backgroundColor: '#7d8597', color: 'white', textAlign: 'center', fontSize: '12px', fontWeight: 500, margin: '0 auto' }}>
            {(params.page - 1) * params.limit + i + 1}
         </div>),
      },
      //Name column
      {
         title: formatMessage({ id: 'dashboard.orderName' }),
         key: 'Name',
         align: 'left',
         render: values => {
            return (
               <div
                  style={{
                     color: '#3d405b',
                     fontWeight: 500,
                     textTransform: 'capitalize',
                  }}
               >
                  {values.fullName || ''}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'dashboard.orderEmail' }),
         key: 'Email',
         align: 'center',
         render: values => {
            return (
               <div
                  style={{
                     color: '#3d405b',
                     fontWeight: 500,
                  }}
               >
                  {values.email || ''}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'dashboard.orderPhone' }),
         key: 'phone',
         align: 'center',
         render: values => {
            // const convertPhone = (value) => {
            //    const a = values.phone.split('')
            //    return a.slice(0, 3).join('') + ' ' + a.slice(3, 6).join('') + ' ' + a.slice(6, a.length).join('')

            // }


            return (
               <div
                  style={{
                     color: '#3d405b',
                     fontWeight: 500,
                  }}
               >
                  {/* {convertPhone(values.phone) || ''} */}
                  {values.phone || ''}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'dashboard.orderTotal' }),
         key: 'OrderTotal',
         align: 'center',
         render: values => {
            return (
               <div
                  style={{
                     color: '#3d405b',
                     fontWeight: 500,
                  }}
               >
                  {numeral(values?.grandTotal).format(0, 0) || ''} đ
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'dashboard.orderStatus' }),
         key: 'OrderStatus',
         align: 'center',
         render: values => {
            return (
               <div
                  style={{
                     color: '#3d405b',
                     fontWeight: 500,
                     textTransform: 'capitalize',
                  }}
               >
                  {showOrderStatus(values?.orderStatus) || ''}
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'dashboard.orderDate' }),
         key: 'OrderDate',
         align: 'center',
         render: values => {
            return (
               <div
                  style={{
                     color: '#3d405b',
                     fontWeight: 500,
                  }}
               >
                  <div>{dayjs(values?.createdAt).format('DD/MM/YYYY') || ''}</div>
               </div>
            )
         },
      },
      {
         title: formatMessage({ id: 'product.action' }),
         key: 'action',
         align: 'center',
         render: values => {
            return (
               <div
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     justifyContent: 'center',
                     alignContent: 'center',
                  }}
               >
                  <Button
                     type="primary"
                     shape="circle"
                     style={{ backgroundColor: '#4361ee' }}
                     icon={<EyeOutlined />}
                     onClick={() => {
                        history.push(`/orders/${values.id}`)
                        window.scrollTo(0, 0)
                     }}
                  />
               </div>
            )
         },
      },
   ]
   return (
      <Card title={formatMessage({ id: 'dashboard.orderLatest' })} style={{ borderRadius: '1rem', boxShadow: '0px 9px 30px rgb(51 83 145 / 8%)' }}>
         <Table
            columns={columns}
            dataSource={listOrder?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.slice(0, 7)}
            rowKey="id"
            loading={loading}
            pagination={false}
         />
      </Card>
   )
}



export default connect(({ loading, order }: ConnectState) => ({
   loading: loading.effects['order/getListOrderModel'],
   listOrder: order.listOrder,
}))(OrderLatestPage)