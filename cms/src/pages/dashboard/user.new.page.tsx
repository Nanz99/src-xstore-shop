import React, { useMemo, useState } from 'react'
import { connect, getLocale, history, useIntl, useLocation } from 'umi'
import { ConnectState } from '@/models/connect';
import { Button, Card, Table, Tag } from 'antd';
import { ProductItem } from '@/models/product.model';
import { ColumnProps } from 'antd/lib/table';
import Avatar from 'antd/lib/avatar/avatar';
import {  EyeOutlined, FileImageOutlined } from '@ant-design/icons';
import './styles.less';
import dayjs from 'dayjs';

class Params {
  page: number = 1
  limit: number = 99999
  name?: string
  verified?: boolean
  status?: number
  sortByPrice?: string
  sortByDate?: string
  condition?: string
}

function UserNewPage({ dispatch, listProducts, loading, listCustomer }) {
  const [params, setParams] = useState(new Params());
  const { pathname } = useLocation()
 const { formatMessage } = useIntl()
   const locale = getLocale()
  const fetch = async () => {
    dispatch({ type: 'dashboard/getListCustomer', payload: params })
  }
  
  useMemo(() => {
    fetch()
  }, [params, pathname])
  const columns: ColumnProps<ProductItem>[] = [
    //Index column
    {
     title: formatMessage({ id: 'product.index' }),
      key: 'ID',
      align: 'center',
      render: (v, t, i) => (<div style={{height: '20px', width:'20px',lineHeight: '20px',borderRadius:'50%', backgroundColor:'#7d8597', color:'white', textAlign:'center', fontSize: '12px', fontWeight: 500}}>
         {(params.page - 1) * params.limit + i + 1}
      </div>),
    },
    {
      title: formatMessage({ id: 'dashboard.userName' }),
      align: 'left',
      key: 'userName',
      render: values => {
        return (
          <div >
          {values?.firstName}  {values?.lastName} 
          </div>
        )
      },
    },

    //Name column
    {
      title: formatMessage({ id: 'dashboard.userEmail' }),
      key: 'userEmail',
      align: 'center',
      render: values => {
        return (
          
          <div
            style={{
              color:'#3d405b',
              fontWeight: 500,
            
            }}
          >
                  
                {values?.email || ''} 
           

          </div>
        )
      },
    },
    {
      title: formatMessage({ id: 'dashboard.userPhone' }),
      key: 'userPhone',
      align: 'center',
      render: values => {
        return (
          <div
            style={{
              color:'#3d405b',
              fontWeight: 500,
             
            }}
          >
            {values?.phone} 
          </div>
        )
      },
    },
    // {
    //   title: formatMessage({ id: 'dashboard.loginLasted' }),
    //   key: 'loginLasted',
    //   align: 'center',
    //   render: values => {
    //     return (
    //       <div
    //         style={{
    //           color:'#3d405b',
    //           fontWeight: 500,
    //           textTransform: 'capitalize',
    //         }}
    //       >
    //           {dayjs(values?.lastLogin).format(
    //                  'DD/MM/YYYY',
    //               )}
    //       </div>
    //     )
    //   },
    // },
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
            <Button type="primary" shape="circle" style={{backgroundColor:'#4361ee'}} icon={<EyeOutlined />} onClick={() => {
              history.push(`/account/profile/${values.id}`)
              window.scrollTo(0, 0)
              }}/>
          </div>
        )
      },
    },



  ]

  return (
    <div>
       <Card title={formatMessage({ id: 'dashboard.userLatest' })} style={{ borderRadius: '1rem', boxShadow:'0px 9px 30px rgb(51 83 145 / 8%)'}}>
          <Table
            columns={columns}
            dataSource={listCustomer?.filter(item => item.status === 1)?.sort((a,b) => b.id - a.id)?.slice(0,7)}
            rowKey="id"
            loading={loading}
            pagination={false}
         />
       </Card>
     
    </div>
  )
}


export default connect(
  ({ products, loading, dashboard }: ConnectState) => ({
    loading: loading.effects['dashboard/getListCustomer'],
    listCustomer: dashboard?.listCustomer || [],
    listProducts: products?.listProducts || [],
    total: products.total,
  }),
)(UserNewPage)